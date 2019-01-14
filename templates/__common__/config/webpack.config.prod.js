// native
const path = require('path');

// packages
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const AssetsWebpackPlugin = require('assets-webpack-plugin');

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

const assetsWebpackPluginInstance = new AssetsWebpackPlugin({
  filename: 'webpack-assets.json',
  path: paths.appDistScripts,
  entrypoints: true,
  fileTypes: ['js', 'mjs'],
  update: true,
});

// some additional production plugins on top of what "mode: production" provides
modernConfig.plugins.push(
  new webpack.HashedModuleIdsPlugin(),
  assetsWebpackPluginInstance
);

legacyConfig.plugins.push(
  new webpack.HashedModuleIdsPlugin(),
  assetsWebpackPluginInstance
);

module.exports = [modernConfig, legacyConfig];
