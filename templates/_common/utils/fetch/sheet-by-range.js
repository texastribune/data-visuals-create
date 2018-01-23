'use strict';

const authorize = require('./authorize');
const google = require('googleapis');

function sheetByRange(spreadsheetId, range, { majorDimension = 'ROWS' } = {}) {
  return new Promise((resolve, reject) => {
    authorize(auth => {
      const sheets = google.sheets({ auth, version: 'v4' });

      sheets.spreadsheets.values.get(
        {
          majorDimension,
          range,
          spreadsheetId,
        },
        (err, res) => {
          if (err) return reject(err);

          resolve(res.values);
        }
      );
    });
  });
}

module.exports = sheetByRange;
