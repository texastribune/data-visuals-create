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
  `<div class="dv201808-graphic dv201808-graphic--centered dv201808-graphic--centered-narrow" data-frame-src="${mainPath}" data-frame-sandbox="allow-scripts allow-same-origin"></div>`
)}`);

    console.log(`
Next, add the style code snippet found in ${colors.yellow(
  'app/styles/raw-plugin-styles.html'
)} to the CSS content section of the Raw Plugin`);

    console.log(`
Then, add this line to the JavaScript content section of the Raw Plugin:
${colors.yellow(
  '<script src="https://cdn.texastribune.org/lib/@newswire/frames@0.3.1/index.umd.js"></script>'
)}
${colors.yellow('<script>newswireFrames.autoInitFrames();</script>')}`);
  }
});
