'use strict';

const colors = require('ansi-colors');
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
Upload of ${colors.yellow(numFiles)} file${numFiles === 1 ? '' : 's'} complete.

Good work! The primary page of this project can be found at:
${colors.blue.underline(mainPath)} (This has been copied to your clipboard.)`);

  if (projectType === 'graphic') {
    console.log(`
If you are deploying a graphic in a CMS story, there are a few steps. First,
add this in the Content section of the Raw Plugin:
${colors.yellow(
  `<div class="dv201808-graphic dv201808-graphic--centered dv201808-graphic--centered-narrow" data-pym-src="${mainPath}">Loading...</div>`
)}`);

    console.log(`
Next, add the markup found in this gist to the CSS content section of the Raw Plugin:
(Assign different classes to the placeholder <div> to get different alignments.)
${colors.yellow(
  'https://gist.github.com/rdmurphy/8b137477dce63b8e9c507f9f7369b2f5'
)}`);

    console.log(`
Then, add this line to the JavaScript content section of the Raw Plugin:
${colors.yellow(
  '<script defer src="https://pym.nprapps.org/pym.v1.min.js"></script>'
)}`);
  }
});
