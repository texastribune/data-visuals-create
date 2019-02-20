// native
const path = require('path');

/**
 * List of image file extensions for use in tasks.
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

/**
 * Helper to run a collection of Promise-returning functions in parallel.
 *
 * @param {Array<Function>} fns
 * @returns {Function}
 */
const parallel = fns => () => Promise.all(fns.map(fn => fn()));

/**
 * Helper to run a series of Promise-returning functions in a series.
 *
 * @param {Array<Function>} fns
 * @returns {void}
 */
const series = async fns => {
  for (const fn of fns) {
    await fn();
  }
};

module.exports = {
  ensureSlash,
  isImagePath,
  parallel,
  replaceExtension,
  series,
  validImageExtensions,
};
