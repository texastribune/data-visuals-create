'use strict';

const colors = require('ansi-colors');
const path = require('path');
const s3 = require('./s3');

const config = require('../../project.config');
const paths = require('../../config/paths');

const Bucket = config.assetsBucket;

(async () => {
  const workspaceFiles = await s3.downloadFiles(
    path.join(config.id, 'raw_workspace'),
    {
      Bucket,
      dest: paths.appWorkspace,
    }
  );

  const numFiles = workspaceFiles.length;

  console.log(`
  Download of ${colors.yellow(numFiles)} asset file${
    numFiles === 1 ? '' : 's'
  } complete.
  `);
})();
