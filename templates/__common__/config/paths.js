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
  appDistStyles: resolveApp('dist/styles'),
  appMain: resolveApp('app/scripts/main.js'),
  appNodeModules: resolveApp('node_modules'),
  appLegacyPolyfills: resolveApp('config/legacy-polyfills.js'),
  appModernPolyfills: resolveApp('config/modern-polyfills.js'),
  appScripts: resolveApp('app/scripts'),
  appScriptPacks: resolveApp('app/scripts/packs'),
  appSrc: resolveApp('app'),
  appStyles: resolveApp('app/styles'),
  appTmp: resolveApp('.tmp'),
  appTmpStyles: resolveApp('.tmp/styles'),
};
