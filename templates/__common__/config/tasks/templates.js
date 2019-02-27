// native
const path = require('path');

// packages
const fs = require('fs-extra');
const glob = require('fast-glob');
const { minify } = require('html-minifier');
const quaff = require('quaff');

// internal
const { isProductionEnv } = require('../env');
const { ensureSlash } = require('../utils');
const nunjucksEnv = require('./nunjucks');
const paths = require('../paths');

const processTemplate = async (filepath, data) => {
  // grab the path relative to the source directory
  const relativePath = path.relative(paths.appSrc, filepath);

  // pull the relative path's extension and name
  const { ext, name } = path.parse(relativePath);

  // we always use "pretty" URLs, so we alter the pathname if it is index.html
  const pathname =
    name === 'index'
      ? relativePath.replace('index.html', '')
      : relativePath.replace(ext, '');

  // use `pathname` from above to tell nunjucks what the current page URL will be
  nunjucksEnv.addGlobal(
    'CURRENT_PAGE_URL',
    ensureSlash(`${paths.appProjectUrl}${pathname}`)
  );

  // compile the HTML!
  let compiledHtml;

  try {
    compiledHtml = nunjucksEnv.render(filepath, { data });
  } catch (err) {
    throw err;
  }

  // if we're in production mode, minify the HTML
  if (isProductionEnv) {
    compiledHtml = minify(compiledHtml, {
      collapseWhitespace: true,
      minifyJS: true,
    });
  }

  // determine if we need to go to the tmp or dist directory
  const baseDistOrTmp = isProductionEnv ? paths.appDist : paths.appTmp;

  // build the output path
  const outputPath = path.join(baseDistOrTmp, pathname, 'index.html');

  // write the file!
  await fs.outputFile(outputPath, compiledHtml);

  // return the path of the output file
  return {
    inputPath: filepath,
    outputPath,
    relativePath,
    modifiedRelativePath: pathname,
  };
};

module.exports = async () => {
  // load all the data in the data directory with quaff for use in templating
  const data = await quaff(paths.appData);

  // find all the HTML files in the source directory, excluding ones in templates and scripts
  const files = await glob('**/*.html', {
    absolute: true,
    cwd: paths.appSrc,
    ignore: ['templates/**', 'scripts/**'],
  });

  const feedback = Promise.all(
    files.map(filepath => processTemplate(filepath, data))
  );

  return feedback;
};
