// native
const path = require('path');
const url = require('url');

// packages
const fs = require('fs-extra');

// internal
const config = require('../project.config');
const { ensureSlash } = require('./utils');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

function getPublicPath() {
  return ensureSlash(`https://${config.bucket}/${config.folder}`);
}

function getServedPath() {
  const publicUrl = getPublicPath();
  const servedUrl = url.parse(publicUrl).pathname;

  return servedUrl;
}

module.exports = {
  appAssets: resolveApp('app/assets'),
  appData: resolveApp(config.dataDir || 'data'),
  appDist: resolveApp('dist'),
  appDistAssets: resolveApp('dist/assets'),
  appDistManifest: resolveApp('dist/rev-manifest.json'),
  appDistScripts: resolveApp('dist/scripts'),
  appDistStyles: resolveApp('dist/styles'),
  appMain: resolveApp('app/scripts/main.js'),
  appNodeModules: resolveApp('node_modules'),
  appLegacyPolyfills: resolveApp('config/legacy-polyfills.js'),
  appModernPolyfills: resolveApp('config/modern-polyfills.js'),
  appScripts: resolveApp('app/scripts'),
  appScriptPacks: resolveApp('app/scripts/packs'),
  appSrc: resolveApp('app'),
  appStyles: resolveApp('app/styles'),
  appTemplates: resolveApp('app/templates'),
  appTmp: resolveApp('.tmp'),
  appTmpStyles: resolveApp('.tmp/styles'),
  appProjectUrl: getPublicPath(),
  appServedPath: getServedPath(),
  appWorkspace: resolveApp('workspace'),
  appDirectory,
};
