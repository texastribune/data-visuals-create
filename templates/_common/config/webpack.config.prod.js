const ManifestPlugin = require('webpack-manifest-plugin');
const path = require('path');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config');
const projectConfig = require('../project.config');

const paths = require('./paths');

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
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new ManifestPlugin({ basePath: 'scripts/', fileName: 'rev-manifest.json' }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      comparisons: false,
    },
    output: {
      comments: false,
    },
    sourceMap: true,
  })
);

module.exports = productionConfig;
