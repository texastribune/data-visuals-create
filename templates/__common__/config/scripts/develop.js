// internal
const { series } = require('../utils');

// internal
const api = require('../tasks/api');
const clean = require('../tasks/clean');
const serve = require('../tasks/serve');
const styles = require('../tasks/styles');
const templates = require('../tasks/templates');

async function develop() {
  await series([clean, () => series([api, styles, templates]), serve]);
}

develop().catch(console.error);
