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

const modernConfig = Object.assign(
  {},
  generateBaseConfig({ PROJECT_URL, esModules: true }),
  {
    mode: 'production',
    bail: true,
    devtool: 'source-map',
    output: {
      path: path.join(paths.appDist, '/scripts/'),
      publicPath,
      filename: '[name].[chunkhash:10].mjs',
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      // switch the production minifier to Terser
      minimizer: [
        new TerserPlugin({
          test: /\.m?js(\?.*)?$/i,
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
    },
  }
);

const legacyConfig = Object.assign(
  {},
  generateBaseConfig({ PROJECT_URL, esModules: false }),
  {
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
      // switch the production minifier to Terser
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
    },
  }
);

const assets = Object.create(null);

// some additional production plugins on top of what "mode: production" provides
modernConfig.plugins.push(
  new webpack.HashedModuleIdsPlugin(),
  new WebpackAssetsManifest({
    assets,
    entrypoints: true,
    entrypointsKey: 'mjs:entrypoints',
    output: paths.appDistManifest,
    publicPath: 'scripts/',
    writeToDisk: true,
  })
);

legacyConfig.plugins.push(
  new webpack.HashedModuleIdsPlugin(),
  new WebpackAssetsManifest({
    assets,
    entrypoints: true,
    entrypointsKey: 'js:entrypoints',
    output: paths.appDistManifest,
    publicPath: 'scripts/',
    writeToDisk: true,
  })
);

module.exports = [modernConfig, legacyConfig];
