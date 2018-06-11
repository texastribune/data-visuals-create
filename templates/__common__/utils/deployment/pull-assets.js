'use strict';

const chalk = require('chalk');
const path = require('path');
const s3 = require('./s3');

const config = require('../../project.config');
const paths = require('../../config/paths');

(async () => {
  const assetFiles = await s3.downloadFiles(
    path.join(config.folder, 'raw_assets'),
    {
      dest: paths.appAssets,
    }
  );

  const numAssets = assetFiles.length;
  console.log(`
  Download of ${chalk.yellow(numAssets)} asset file${
    numAssets === 1 ? '' : 's'
  } complete.
  `);

  const dataFiles = await s3.downloadFiles(
    path.join(config.folder, 'raw_data'),
    {
      dest: paths.appData,
    }
  );

  const numData = dataFiles.length;
  console.log(`
  Download of ${chalk.yellow(numData)} data file${
    numData === 1 ? '' : 's'
  } complete.
  `);
})();
