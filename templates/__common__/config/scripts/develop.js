// internal
const { clearConsole, series } = require('../utils');

// tasks
const parseFigma2html = require('../tasks/parse-figma2html');
const api = require('../tasks/api');
const clean = require('../tasks/clean');
const serve = require('../tasks/serve');

async function develop() {
  clearConsole();

  const runner = series([parseFigma2html, clean, api, serve]);

  await runner();
}

develop().catch(console.error);
