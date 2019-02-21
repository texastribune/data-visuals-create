// internal
const { parallel, series } = require('../utils');

// tasks
const api = require('../tasks/api');
const clean = require('../tasks/clean');
const copy = require('../tasks/copy');
const images = require('../tasks/images');
const rev = require('../tasks/rev');
const revReplace = require('../tasks/rev-replace');
const scripts = require('../tasks/scripts');
const styles = require('../tasks/styles');
const templates = require('../tasks/templates');

async function build() {
  const runner = series([
    clean,
    scripts,
    parallel([api, images, styles]),
    copy,
    templates,
    rev,
    revReplace,
  ]);

  await runner();
}

function logErrorMessage(err) {
  const message = err != null && err.message;

  console.log((message || err) + '\n\n');
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
