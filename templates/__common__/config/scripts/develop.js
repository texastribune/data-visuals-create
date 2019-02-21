// internal
const { clearConsole, series } = require('../utils');

// tasks
const api = require('../tasks/api');
const clean = require('../tasks/clean');
const serve = require('../tasks/serve');
const styles = require('../tasks/styles');
const templates = require('../tasks/templates');

async function develop() {
  clearConsole();

  const runner = series([clean, series([api, styles, templates]), serve]);

  await runner();
}

develop().catch(console.error);
