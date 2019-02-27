// native
const path = require('path');
const url = require('url');

// packages
const fs = require('fs-extra');
const journalize = require('journalize');
const nunjucks = require('nunjucks');
const parse = require('date-fns/parse');

// internal
const config = require('../../project.config');
const parseData = require('../../utils/parse-data');
const paths = require('../paths');
const { isProductionEnv, nodeEnv } = require('../env');

const PROJECT_URL = `https://${config.bucket}/${config.folder}/`;

const customFilters = config.customFilters;

const env = nunjucks.configure([paths.appTemplates, paths.appSrc], {
  autoescape: false,
  noCache: true,
  trimBlocks: true,
});

/*
Adds the current runtime state of the project. Good for excluding portions of
templates that do not need to be there during testing.
 */
env.addGlobal('ENV', nodeEnv);

/*
The project's current full URL.
 */
env.addGlobal('PROJECT_URL', paths.appProjectUrl);

/*
The project's current served path.
 */
env.addGlobal('SERVED_PATH', paths.appServedPath);

/*
Adds static function globally. Normalizes file paths for deployment.
 */
function static_(p) {
  if (isProductionEnv) p = path.join(config.folder, p);

  return url.resolve('/', p);
}

env.addGlobal('static', static_);

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
  if (isProductionEnv) {
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

let manifest = null;

env.addGlobal(
  'javascriptPack',
  (key, { mjs = false, shouldDefer = true } = {}) => {
    let scripts;

    if (!isProductionEnv) {
      if (mjs) {
        scripts = [`/scripts/${key}.mjs`];
      } else {
        return []; // noop the non MJS pack in development
      }
    } else {
      if (manifest == null) {
        manifest = fs.readJsonSync(
          path.join(paths.appDistScripts, 'webpack-assets.json')
        );
      }

      if (!key in manifest)
        throw new Error(
          `The "key" provided to javascriptPack is not a valid entrypoint`
        );

      scripts = manifest[key][mjs ? 'mjs' : 'js'];
    }

    if (mjs) {
      return scripts
        .map(src => `<script type="module" src="${src}"></script>`)
        .join('\n');
    } else {
      return scripts
        .map(
          src =>
            `<script nomodule ${
              shouldDefer ? 'defer' : 'async'
            } src="${src}"></script>`
        )
        .join('\n');
    }
  }
);
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
