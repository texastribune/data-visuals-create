'use strict';

const chalk = require('chalk');
const path = require('path');
const { write } = require('clipboardy');

const s3 = require('./s3');

const config = require('../../project.config');
const paths = require('../../config/paths');

s3
  .uploadFiles(paths.appDist, {
    dest: config.folder,
    isPublicFile: true,
    shouldCache: true,
  })
  .then(async files => {
    const numFiles = files.length;
    const mainPath = 'https://' + path.join(config.bucket, config.folder, '/');

    await write(mainPath);

    console.log(`
Upload of ${chalk.yellow(numFiles)} file${numFiles === 1 ? '' : 's'} complete.

Good work! The main page of this project can be found at ${chalk.blue.underline(
      mainPath
    )}. (This has been copied to your clipboard.)

If you are deploying a graphic in a CMS story, this is likely all you need:
${chalk.yellow(`<div data-pym-src="${mainPath}">Loading...</div>`)}

Don't forget to uncheck the Facebook Instant and AMP boxes in the CMS! This
prevents the story from being pulled into those systems, where our graphics
do not work.
    `);
  });
