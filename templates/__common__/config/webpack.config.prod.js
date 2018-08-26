// native
const path = require('path');

// packages
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');

// internal
const { generateBaseConfig } = require('./webpack-utils');
const paths = require('./paths');
const projectConfig = require('../project.config');

const PROJECT_URL = `/${projectConfig.folder}/`;
const publicPath = '/' + path.join(projectConfig.folder, '/scripts/');

const config = Object.assign({}, generateBaseConfig({ PROJECT_URL }), {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  output: {
    path: path.join(paths.appDist, '/scripts/'),
    publicPath,
    filename: '[name].[chunkhash:10].js',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
});

// switch the production minifier to Terser
config.optimization.minimizer = [
  new TerserPlugin({
    cache: true,
    parallel: true,
    sourceMap: true,
  }),
];

// some additional production plugins on top of what "mode: production" provides
config.plugins.push(
  new webpack.HashedModuleIdsPlugin(),
  new WebpackAssetsManifest({
    entrypoints: true,
    output: paths.appDistManifest,
    publicPath: 'scripts/',
    writeToDisk: true,
  })
);

module.exports = config;
