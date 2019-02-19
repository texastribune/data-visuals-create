// packages
const fancyLog = require('fancy-log');
const PluginError = require('plugin-error');
const webpack = require('webpack');

// internal
const { isProductionEnv } = require('../env');

const webpackConfig = isProductionEnv
  ? require('../webpack.config.prod')
  : require('../webpack.config.dev');
const bundle = webpack(webpackConfig);

module.exports = done => {
  bundle.run((err, stats) => {
    if (err) throw new PluginError('webpack', err);
    fancyLog('[webpack]', stats.toString({ colors: true }));

    done();
  });
};
