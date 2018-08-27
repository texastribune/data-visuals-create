// packages
const fs = require('fs-extra');

// internal
const { isImagePath } = require('./utils');
const paths = require('../paths');

module.exports = async () => {
  await fs.copy(paths.appAssets, paths.appDistAssets, {
    dereference: true,
    filter: src => !isImagePath(src),
  });
};
