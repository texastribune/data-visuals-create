// packages
const formatMessages = require('webpack-format-messages');
const webpack = require('webpack');

// internal
const { isProductionEnv } = require('../env');

const webpackConfig = isProductionEnv
  ? require('../webpack.config.prod')
  : require('../webpack.config.dev');
const bundle = webpack(webpackConfig);

module.exports = () => {
  return new Promise((resolve, reject) => {
    bundle.run((err, multiStats) => {
      let messages = { errors: [], warnings: [] };

      if (err) {
        if (!err.message) {
          return reject(err);
        }

        messages = formatMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        multiStats.stats.forEach(stats => {
          const { errors, warnings } = formatMessages(stats);

          messages.errors.push(...errors);
          messages.warnings.push(...warnings);
        });
      }

      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }

        return reject(new Error(messages.errors.join('\n\n')));
      }

      resolve({ stats: multiStats, warnings: messages.warnings });
    });
  });
};
