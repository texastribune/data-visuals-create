// native
const path = require('path');

// packages
const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');
const fs = require('fs-extra');
const glob = require('fast-glob');
const postcss = require('postcss');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const sass = require('sass');

// internal
const paths = require('../paths');
const { isProductionEnv } = require('../env');
const { replaceExtension } = require('../utils');

const postcssInstance = postcss([
  postcssFlexbugsFixes,
  autoprefixer({ flexbox: 'no-2009' }),
]);

const processSass = async filepath => {
  // compile the sass file
  let compiled;

  try {
    compiled = sass.renderSync({
      file: filepath,
      includePaths: ['node_modules'],
    });
  } catch (err) {
    throw {
      source: 'sass',
      type: 'error',
      file: path.relative(paths.appDirectory, err.file),
      message: err.formatted,
    };
  }

  // prep out the CSS
  let css = compiled.css;

  // pass CSS through autoprefixer with postcss
  const { css: processed } = await postcssInstance.process(css, {
    from: filepath,
  });
  css = processed;

  // if we're in production, minify the CSS
  if (isProductionEnv) {
    const cssCleaner = new CleanCSS({ returnPromise: true });
    const { styles: minified } = await cssCleaner.minify(css);
    css = minified;
  }

  // get the path relative to its source location
  const relativePath = replaceExtension(
    path.relative(paths.appStyles, filepath),
    '.css'
  );

  // determine the new path relative to the destination location
  const newPath = path.join(
    isProductionEnv ? paths.appDistStyles : paths.appTmpStyles,
    relativePath
  );

  // output compiled file
  await fs.outputFile(newPath, css);

  return { inputPath: filepath, relativePath };
};

module.exports = async () => {
  const files = await glob('*.scss', {
    absolute: true,
    cwd: paths.appStyles,
    ignore: ['_*'],
  });

  return await Promise.all(files.map(processSass));
};
