// native
const path = require('path');

// internal
const paths = require('./paths');
const { generateBaseConfig } = require('./webpack-utils');

const PROJECT_URL = '/';

const config = Object.assign(
  {},
  generateBaseConfig({ esModules: true, PROJECT_URL }),
  {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    output: {
      path: path.join(paths.appTmp, '/scripts/'),
      pathinfo: true,
      publicPath: '/scripts/',
      filename: '[name].mjs',
    },
  }
);

module.exports = config;
