'use strict';

const chalk = require('chalk');
const path = require('path');
const s3 = require('./s3');

const config = require('../../project.config');
const paths = require('../../config/paths');

s3
  .downloadFiles(path.join(config.folder, 'raw_assets'), {
    dest: paths.appAssets,
  })
  .then(files => {
    const numFiles = files.length;
    console.log(`
Download of ${chalk.yellow(numFiles)} file${numFiles === 1 ? '' : 's'} complete.
    `);
  });
