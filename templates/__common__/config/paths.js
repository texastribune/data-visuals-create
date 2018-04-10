'use strict';

const fs = require('fs-extra');
const path = require('path');

const config = require('../project.config');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  appAssets: resolveApp('app/assets'),
  appData: resolveApp(config.dataDir || 'data'),
  appDist: resolveApp('dist'),
  appMain: resolveApp('app/scripts/main.js'),
  appNodeModules: resolveApp('node_modules'),
  appPolyfills: resolveApp('config/polyfills.js'),
  appSrc: resolveApp('app'),
  appTmp: resolveApp('.tmp'),
};
