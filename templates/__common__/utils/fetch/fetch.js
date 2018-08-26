'use strict';

const authorize = require('./authorize');
const { google } = require('googleapis');

const TYPES = {
  doc: 'text/html',
  sheet: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const RETRY_WITH_BACKOFF_ERRORS = [
  'userRateLimitExceeded',
  'quotaExceeded',
  'internalServerError',
  'backendError',
];

const MAX_RETRIES = 5;

function fetch(files, cb) {
  if (!Array.isArray(files)) files = [files];

  authorize(auth => {
    const drive = google.drive({ auth, version: 'v3', encoding: null });

    files.forEach(file => {
      // skip everything if it's a google sheet, we use a different API in `get-data`
      if (file.type === 'gsheet') return cb(null, null, file);

      const fileId = file.fileId;
      const mimeType = TYPES[file.type];

      const req = { fileId, mimeType };

      tryExportUntilSuccess({ drive, req, file, iteration: 0 }, cb);
    });
  });
}

function tryExportUntilSuccess(opts, cb) {
  opts.drive.files.export(
    opts.req,
    { responseType: 'arraybuffer' },
    (err, { data: res }) => {
      if (err) {
        if (
          err.code === 403 &&
          RETRY_WITH_BACKOFF_ERRORS.some(e => e === err.errors[0].reason)
        ) {
          if (opts.iteration > MAX_RETRIES)
            return cb(
              new Error(
                `We tried so hard to get \`${
                  opts.req.fileId
                }\`, but had no luck.`
              )
            );
          return setTimeout(
            () => tryExportUntilSuccess(opts, cb),
            Math.pow(opts.iteration++, 2) * Math.random()
          );
        } else {
          cb(err);
        }
      }

      cb(null, res, opts.file);
    }
  );
}

module.exports = fetch;
