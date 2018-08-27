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

module.exports = { isImagePath, validImageExtensions };
