// packages
const chalk = require('chalk');
const fs = require('fs-extra');

// internal
const { isImagePath } = require('./utils');
const paths = require('../paths');

module.exports = async () => {
  if (await fs.pathExists(paths.appAssets)) {
    await fs.copy(paths.appAssets, paths.appDistAssets, {
      dereference: true,
      filter: src => !isImagePath(src),
    });
  } else {
    console.warn(chalk.grey`No "assets" directory found, skipping copy task.`);
  }
};
