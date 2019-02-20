// packages
const webpack = require('webpack');

// internal
const { isProductionEnv } = require('../env');

const webpackConfig = isProductionEnv
  ? require('../webpack.config.prod')
  : require('../webpack.config.dev');
const bundle = webpack(webpackConfig);

module.exports = () => {
  return new Promise((resolve, reject) => {
    bundle.run((err, stats) => {
      if (err) reject(new Error(err));
      console.log(stats.toString({ colors: true }));

      resolve();
    });
  });
};
