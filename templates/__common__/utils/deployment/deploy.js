'use strict';

const chalk = require('chalk');
const path = require('path');
const { write } = require('clipboardy');

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

  console.log(`
Upload of ${chalk.yellow(numFiles)} file${numFiles === 1 ? '' : 's'} complete.

Good work! The primary page of this project can be found at:
${chalk.blue.underline(mainPath)} (This has been copied to your clipboard.)`);

  if (projectType === 'graphic') {
    console.log(`
If you are deploying a graphic in a CMS story, you'll need to add
this in the HTML section of a Raw Plugin:
${chalk.yellow(`<div data-pym-src="${mainPath}">Loading...</div>`)}`);
  }
});
