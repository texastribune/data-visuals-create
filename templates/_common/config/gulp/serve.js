'use strict';

const gulp = require('gulp');
const path = require('path');
const stripAnsi = require('strip-ansi');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const bs = require('./browsersync');

const paths = require('../paths');
const webpackConfig = require('../webpack.config');
const bundler = webpack(webpackConfig);

bundler.plugin('done', function(stats) {
  if (stats.hasErrors() || stats.hasWarnings()) {
    return bs.sockets.emit('fullscreen:message', {
      title: 'Webpack Error:',
      body: stripAnsi(stats.toString()),
      timeout: 100000,
    });
  }

  bs.reload();
});

module.exports = () => {
  bs.init({
    logConnections: true,
    logPrefix: 'IDV',
    https: true,
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true },
      }),
    ],
    notify: false,
    open: false,
    plugins: ['bs-fullscreen-message'],
    port: 3000,
    server: {
      baseDir: ['./.tmp', './app'],
      routes: {
        '/node_modules': 'node_modules',
      },
    },
  });

  gulp.watch(
    ['./app/**/*.html', path.join(paths.appData, '*.json')],
    ['templates']
  );
  gulp.watch(['./app/styles/**/*.scss'], ['styles']);
};
