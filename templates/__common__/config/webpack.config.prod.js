const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config');
const projectConfig = require('../project.config');

const paths = require('./paths');

const PROJECT_URL = `/${projectConfig.folder}/`;

const productionConfig = Object.assign({}, webpackConfig, {
  bail: true,
  devtool: 'source-map',
});

productionConfig.output = {
  path: path.join(paths.appDist, '/scripts/'),
  filename: '[name].[chunkhash:10].js',
  chunkFilename: '[name].[chunkhash:10].chunk.js',
  publicPath: '/' + path.join(projectConfig.folder, '/scripts/'),
  devtoolModuleFilenameTemplate: info =>
    path.relative(paths.appSrc, info.absoluteResourcePath),
};

productionConfig.plugins.push(
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.HashedModuleIdsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      PUBLIC_PATH: JSON.stringify(PROJECT_URL),
    },
  }),
  new ManifestPlugin({ basePath: 'scripts/', fileName: 'rev-manifest.json' }),
  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false,
        comparisons: false,
      },
      output: {
        ascii_only: true,
        comments: false,
      },
    },
    parallel: true,
    cache: true,
    sourceMap: true,
  })
);

module.exports = productionConfig;
