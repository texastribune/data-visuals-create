// native
const path = require('path');

// packages
const fs = require('fs-extra');

// internal
const config = require('../project.config');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  appAssets: resolveApp('app/assets'),
  appData: resolveApp(config.dataDir || 'data'),
  appDist: resolveApp('dist'),
  appDistAssets: resolveApp('dist/assets'),
  appDistManifest: resolveApp('dist/rev-manifest.json'),
  appMain: resolveApp('app/scripts/main.js'),
  appNodeModules: resolveApp('node_modules'),
  appPolyfills: resolveApp('config/polyfills.js'),
  appScripts: resolveApp('app/scripts'),
  appScriptPacks: resolveApp('app/scripts/packs'),
  appSrc: resolveApp('app'),
  appTmp: resolveApp('.tmp'),
};
