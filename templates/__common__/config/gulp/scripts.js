// packages
const gulpUtil = require('gulp-util');
const webpack = require('webpack');

// internal
const { isProductionEnv } = require('../env');

const webpackConfig = isProductionEnv
  ? require('../webpack.config.prod')
  : require('../webpack.config');
const bundle = webpack(webpackConfig);

module.exports = done => {
  bundle.run((err, stats) => {
    if (err) throw new gulpUtil.PluginError('webpack', err);
    gulpUtil.log('[webpack]', stats.toString({ colors: true }));

    done();
  });
};
