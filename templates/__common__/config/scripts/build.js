// internal
const { parallel, series } = require('../utils');

// packages
const colors = require('ansi-colors');

// intenral
const { logErrorMessage } = require('../utils');

// tasks
const lastBuildTime = require('../tasks/last-build-time');
const api = require('../tasks/api');
const clean = require('../tasks/clean');
const copy = require('../tasks/copy');
const images = require('../tasks/images');
const rev = require('../tasks/rev');
const revReplace = require('../tasks/rev-replace');
const scripts = require('../tasks/scripts');
const styles = require('../tasks/styles');
const templates = require('../tasks/templates');
const unusedCSS = require('../tasks/unused-css');

async function build() {
  const runner = series([
    lastBuildTime,
    clean,
    scripts,
    // parallel([api, images, styles]),
    copy,
    // templates,
    unusedCSS,
    rev,
    revReplace,
  ]);

  await runner();
}

build()
  .then(() => {
    console.log(colors.bold.green('The build was a success!'));
  })
  .catch(err => {
    console.log(
      colors.bold.red("Build failed. Here's what possibly went wrong:\n")
    );
    logErrorMessage(err);
  });
