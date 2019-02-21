'use strict';

const colors = require('ansi-colors');
const path = require('path');
const s3 = require('./s3');

const config = require('../../project.config');
const paths = require('../../config/paths');

const Bucket = config.assetsBucket;

(async () => {
  const assetFiles = await s3.downloadFiles(
    path.join(config.id, 'raw_assets'),
    {
      Bucket,
      dest: paths.appAssets,
    }
  );

  const numAssets = assetFiles.length;
  console.log(`
  Download of ${colors.yellow(numAssets)} asset file${
    numAssets === 1 ? '' : 's'
  } complete.
  `);

  const dataFiles = await s3.downloadFiles(path.join(config.id, 'raw_data'), {
    Bucket,
    dest: paths.appData,
  });

  const numData = dataFiles.length;
  console.log(`
  Download of ${colors.yellow(numData)} data file${
    numData === 1 ? '' : 's'
  } complete.
  `);
})();
