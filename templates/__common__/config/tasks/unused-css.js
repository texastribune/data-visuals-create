// native
const path = require('path');

// packages
const fs = require('fs-extra');
const { PurgeCSS } = require('purgecss');
const CleanCSS = require('clean-css');

// internal
const paths = require('../paths');
const { isProductionEnv } = require('../env');
const { replaceExtension } = require('../utils');

// output locations
const stylesFolder = isProductionEnv ? paths.appDistStyles : paths.appTmpStyles;
const htmlFolder = isProductionEnv ? paths.appDist : paths.appTmp;

const parseCSS = async () => {
  let result = [];
  try {
    // run purgeCSS
    result = await new PurgeCSS().purge({
      content: [
        `${htmlFolder}/**/*.html`,
        `${paths.appSrc}/**/*.{js,jsx,ts,tsx}`,
      ],
      css: [`${stylesFolder}/*.css`],
    });
  } catch (err) {
    throw err;
  }
  // [{css: parsedCSS, file: path/to/original/css-file}]
  return result;
};

const writeCSS = async result => {
  let { file, css } = result;

  // get the path relative to its source location
  const relativePath = replaceExtension(
    path.relative(paths.appStyles, file),
    '.css'
  );

  // get the raw file name
  const filename = path.basename(file);

  // create a new path for a nested min folder
  const newPath = path.join(stylesFolder, 'min', filename);

  // minify CSS
  if (isProductionEnv) {
    const cssCleaner = new CleanCSS({ returnPromise: true });
    const { styles: minified } = await cssCleaner.minify(css);
    css = minified;
  }

  // output optimized CSS file
  await fs.outputFile(newPath, css);

  return { inputPath: file, relativePath };
};

module.exports = async () => {
  const strippedCSS = await parseCSS();

  return await Promise.all(strippedCSS.map(writeCSS));
};
