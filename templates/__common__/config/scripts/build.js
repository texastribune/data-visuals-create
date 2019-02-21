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

build().catch(console.error);
