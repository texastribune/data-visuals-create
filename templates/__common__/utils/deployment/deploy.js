'use strict';

const colors = require('ansi-colors');
const path = require('path');
const { write } = require('clipboardy');
const { updateReadMe } = require('./update-readme');
const { updateLogSheet } = require('./update-log-sheet');

const s3 = require('./s3');

const config = require('../../project.config');
const paths = require('../../config/paths');

const projectType = config.projectType;

s3.uploadFiles(paths.appDist, {
  Bucket: config.bucket,
  dest: config.folder,
  isPublicFile: true,
  shouldCache: true,
}).then(async files => {
  const numFiles = files.length;
  const mainPath = 'https://' + path.join(config.bucket, config.folder, '/');

  await write(mainPath);
  await updateReadMe(paths, mainPath, config.files);
  await updateLogSheet(mainPath, config);

  console.log(`
Upload of ${colors.yellow(numFiles)} file${numFiles === 1 ? '' : 's'} complete.

Good work! The primary page of this project can be found at:
${colors.blue.underline(mainPath)} (This has been copied to your clipboard.)

Did you run ${colors.yellow(
    `npm run data:fetch`
  )} before deploying to get the latest data?`);
});
