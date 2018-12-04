// native
const path = require('path');

/**
 * List of image file extensions for use in gulp tasks.
 *
 * @type {String[]}
 */
const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

/**
 * Helper function to quickly determine if a file's extensions matches any
 * of the validImageExtensions.
 *
 * @param {String} filepath
 * @returns {Boolean}
 */
const isImagePath = filepath =>
  validImageExtensions.includes(path.extname(filepath));

/**
 * Helper to swap out a file path's extension.
 *
 * @param {String} npath
 * @param {String} ext
 * @returns {String}
 */
const replaceExtension = (npath, ext) => {
  if (typeof npath !== 'string') {
    return npath;
  }

  if (npath.length === 0) {
    return npath;
  }

  var nFileName = path.basename(npath, path.extname(npath)) + ext;
  return path.join(path.dirname(npath), nFileName);
};

/**
 * Helper to make sure a path either does or does not end in a slash.
 *
 * @param {string} inputPath
 * @param {boolean} needsSlash
 * @returns {string}
 */
const ensureSlash = (inputPath, needsSlash = true) => {
  const hasSlash = inputPath.endsWith('/');

  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
};

module.exports = {
  ensureSlash,
  isImagePath,
  replaceExtension,
  validImageExtensions,
};
