// internal
const { clearConsole, series } = require('../utils');

// tasks
const api = require('../tasks/api');
const clean = require('../tasks/clean');
const serve = require('../tasks/serve');

async function develop() {
  clearConsole();

  const runner = series([clean, api, serve]);

  await runner();
}

develop().catch(console.error);
