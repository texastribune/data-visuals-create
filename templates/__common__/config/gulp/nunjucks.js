'use strict';

const fs = require('fs');
const journalize = require('journalize');
const nunjucks = require('nunjucks');
const parse = require('date-fns/parse');
const path = require('path');
const url = require('url');

const config = require('../../project.config');
const customFilters = require('../../custom-filters');
const parseData = require('../../utils/parse-data');
const paths = require('../paths');

const NODE_ENV = process.env.NODE_ENV;
const PROJECT_URL = `https://${config.bucket}/${config.folder}/`;

const env = nunjucks.configure('./app/templates', {
  autoescape: false,
  noCache: true,
  trimBlocks: true,
});

/*
Adds the current runtime state of the project. Good for excluding portions of
templates that do not need to be there during testing.
 */
env.addGlobal('ENV', NODE_ENV);

/*
Adds static function globally. Normalizes file paths for deployment.
 */
env.addGlobal('static', p => {
  if (NODE_ENV === 'production') p = path.join(config.folder, p);

  return url.resolve('/', p);
});

/*
Creates an absolute path URL.
 */
env.addGlobal('staticAbsolute', (p, noSlash) => {
  noSlash = noSlash || false;

  if (p === '/') {
    noSlash = true;
    p = '';
  }

  return url.resolve(PROJECT_URL, p === '/' ? '' : p) + (noSlash ? '' : '/');
});

/*
Lets you inject the contents of a file into a template. Good for things like
SVG icons.
 */
env.addGlobal('inject', p => {
  if (NODE_ENV === 'production') {
    return fs.readFileSync(path.join(paths.appDist, p), 'utf8');
  }

  let s;

  try {
    s = fs.readFileSync(path.join(paths.appTmp, p), 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      s = fs.readFileSync(path.join(paths.appSrc, p), 'utf8');
    } else {
      throw e;
    }
  }

  return s;
});

/**
 * Map of AP month abbreviations.
 *
 * @type {Map}
 */
const AP_MONTHS = new Map([
  [1, 'Jan.'],
  [2, 'Feb.'],
  [3, 'March'],
  [4, 'April'],
  [5, 'May'],
  [6, 'June'],
  [7, 'July'],
  [8, 'Aug.'],
  [9, 'Sept.'],
  [10, 'Oct.'],
  [11, 'Nov.'],
  [12, 'Dec.'],
]);

env.addGlobal('apFormatDate', input => {
  const date = parse(input);

  const month = AP_MONTHS.get(date.getMonth() + 1);
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${month} ${dayOfMonth}, ${year}`;
});

env.addGlobal('CURRENT_YEAR', new Date().getFullYear());

env.addGlobal('parseData', parseData);

/*
Add `json_script` filter.
 */
const _jsonScriptMap = {
  '>': '\\u003E',
  '<': '\\u003C',
  '&': '\\u0026',
};

const escapeHtmlRegex = new RegExp(
  `[${Object.keys(_jsonScriptMap).join('')}]`,
  'g'
);

function escapeHtml(text) {
  return text.replace(escapeHtmlRegex, m => _jsonScriptMap[m]);
}

env.addFilter('jsonScript', (value, elementId) => {
  return `<script id="${elementId}" type="application/json">${escapeHtml(
    JSON.stringify(value)
  )}</script>`;
});

/*
Set up `journalize`.
 */
for (let key in journalize) {
  let func = journalize[key];

  if (typeof func === 'function') {
    env.addFilter(key, func);
  }
}

/*
Set up any custom filers.
 */
for (let key in customFilters) {
  let func = customFilters[key];

  if (typeof func === 'function') {
    env.addFilter(key, func);
  }
}

module.exports = env;
