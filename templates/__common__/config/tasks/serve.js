// native
const path = require('path');

// packages
const stripAnsi = require('strip-ansi');
const watch = require('glob-watcher');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

// internal
const bs = require('./browsersync');
const paths = require('../paths');
const styles = require('./styles');
const templates = require('./templates');
const webpackConfig = require('../webpack.config.dev');

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

  watch(
    [path.join(paths.appSrc, '**/*.html'), path.join(paths.appData, '*.json')],
    templates
  );
  watch([path.join(paths.appStyles, '/**/*.scss')], styles);
};
