'use strict';

const colors = require('ansi-colors');
const path = require('path');
const s3 = require('./s3');

const config = require('../../project.config');
const paths = require('../../config/paths');

const Bucket = config.assetsBucket;

(async () => {
  const workspaceFiles = await s3.uploadFiles(paths.appWorkspace, {
    Bucket,
    dest: path.join(config.id, 'raw_workspace'),
  });

  const numFiles = workspaceFiles.length;

  console.log(`
  Upload of ${colors.yellow(numFiles)} workspace file${
    numFiles === 1 ? '' : 's'
  } complete.
    `);
})();
