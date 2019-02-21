'use strict';

const AWS = require('aws-sdk');
const cacheLookup = require('./cache-lookup');
const colors = require('ansi-colors');
const crypto = require('crypto');
const fs = require('fs-extra');
const glob = require('fast-glob');
const https = require('https');
const mime = require('mime-types');
const path = require('path');

AWS.config.update({
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
      maxSockets: 20,
    }),
  },
});

const s3 = new AWS.S3();

/**
 * Uploads a file to S3. Checks to see if an identical version of the file
 * already exists, and aborts if so.
 *
 * @param  {String} filename
 * @param  {Object} options
 */
async function uploadFile(filename, options) {
  const opts = Object.assign(
    {},
    {
      isPublicFile: false,
      shouldCache: false,
    },
    options
  );

  const { Bucket } = opts;

  const Key = path.join(opts.dest, flattenPath(filename, opts.source));
  const fullS3Path = path.join(Bucket, Key);

  const isIdentical = await isFileIdenticaltoS3File(filename, Bucket, Key);
  if (isIdentical)
    return console.log(colors.gray(`${fullS3Path}: Has not changed`));

  const Body = fs.createReadStream(filename);
  const ContentType = mime.lookup(filename) || 'application/octet-stream';
  const ACL = opts.isPublicFile ? 'public-read' : 'private';

  const params = {
    ACL,
    Body,
    Bucket,
    ContentType,
    Key,
  };

  if (opts.shouldCache) {
    const cacheParams = cacheLookup(ContentType);
    if (cacheParams) params.CacheControl = cacheParams.control;
  }

  try {
    const data = await s3.putObject(params).promise();
    console.log(colors.green(`Uploaded: ${fullS3Path}`));
    return data;
  } catch (err) {
    throw err;
  }
}

/**
 * Accepts a glob and passes those files to `uploadFile`. Any supplied options
 * are also passed.
 *
 * @param  {String|Array.<String>} dir
 * @param  {Object} opts
 */
async function uploadFiles(dir, opts) {
  opts = Object.assign(
    {
      source: dir,
    },
    opts
  );

  const paths = await glob(path.join(dir, '**', '*'));
  return Promise.all(paths.map(p => uploadFile(p, opts)));
}

/**
 * Downloads an S3 file located at `Key`.
 * @param  {String} Key
 * @param  {Object} options
 */
async function downloadFile(Key, options) {
  const opts = options || {};

  const localFilePath = path.join(opts.dest, flattenPath(Key, opts.s3Dir));

  const isIdentical = await isFileIdenticalToMD5(localFilePath, opts.ETag);
  if (isIdentical) {
    console.log(colors.gray(`${localFilePath}: File already present`));
    return localFilePath;
  }

  const { Bucket } = opts;

  await fs.ensureDir(path.dirname(localFilePath));

  return new Promise(resolve => {
    const output = fs.createWriteStream(localFilePath);
    output.on('finish', () => {
      console.log(colors.green(`Downloaded: ${localFilePath}`));
      return resolve(localFilePath);
    });

    s3.getObject({ Bucket, Key })
      .createReadStream()
      .pipe(output);
  });
}

/**
 * Accepts a directory on S3 and downloads those files to the local machine.
 *
 * @param  {String} s3Dir
 * @param  {Object} options
 */
async function downloadFiles(s3Dir, options) {
  const Prefix = s3Dir;

  const params = {
    Bucket: options.Bucket,
    Prefix,
  };

  // TODO: Support more than 1000 files
  const data = await s3.listObjectsV2(params).promise();

  return Promise.all(
    data.Contents.map(o => {
      const Key = o.Key;
      const ETag = o.ETag;

      const opts = Object.assign({}, options, {
        ETag,
        Key,
        s3Dir,
      });

      return downloadFile(Key, opts);
    })
  );
}

/**
 * Flatten a file's path against its source. Used to remove extra parts of
 * the path that shouldn't interact with S3.
 *
 * @param  {String} filepath
 * @param  {String} source
 * @return {String}
 * @example
 *
 * flattenPath('dist/scripts/main.js', 'dist')
 * # returns 'scripts/main.js'
 *
 * flattenPath('app/assets/images/corgi.jpg', './app/assets')
 * # returns 'images/corgi.jpg'
 */
function flattenPath(filepath, source) {
  const sep = path.sep;
  const distance = path.normalize(source).split(sep).length;

  return path.join.apply(path, filepath.split(sep).slice(distance));
}

/**
 * Takes a file and calculates the md5 hash for it. This is used to make
 * comparisons against the `ETag` of files on S3.
 *
 * @param  {String} filename
 * @param  {Function} callback
 */
function md5HashFile(filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createReadStream(filename);
    const hash = crypto.createHash('md5');

    file.on('data', data => hash.update(data));
    file.on('error', err => {
      // if the file does not exist, that's fine, otherwise propagate the error
      // normally
      if (err.code === 'ENOENT') return resolve(null);

      return reject(err);
    });
    file.on('end', () => resolve(`"${hash.digest('hex')}"`));
  });
}

/**
 * Retrieves the ETag of an object in S3. Because this doesn't try to get the
 * actual file, it's faster than something like `getObject`.
 *
 * @param  {String} Key
 * @return  {Promise}
 */
async function getS3ObjectETag(Bucket, Key) {
  const params = {
    Bucket,
    Key,
  };

  try {
    const data = await s3.headObject(params).promise();
    return data.ETag;
  } catch (err) {
    if (err.code === 'NotFound') {
      return null;
    }

    throw err;
  }
}

/**
 * Checks to see if a local file's MD5 hash matches another MD5 hash. Passes a
 * boolean result to a callback.
 *
 * @param  {String} filename
 * @param  {String} md5
 * @param  {Function} callback
 */
async function isFileIdenticalToMD5(filename, md5) {
  try {
    const fileETag = await md5HashFile(filename);
    return fileETag === null || md5 === null ? false : fileETag === md5;
  } catch (err) {
    throw err;
  }
}

/**
 * Checks to see if a local file and a file on S3 have the same md5 hash.
 * Passes a boolean result to a callback. This function only does a HEAD check
 * against S3 and does not try to download the entire file.
 *
 * @param  {String} filename
 * @param  {String} Key
 * @return {Promise}
 */
async function isFileIdenticaltoS3File(filename, Bucket, Key) {
  try {
    const S3ETag = await getS3ObjectETag(Bucket, Key);
    return await isFileIdenticalToMD5(filename, S3ETag);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  downloadFiles,
  uploadFile,
  uploadFiles,
};
