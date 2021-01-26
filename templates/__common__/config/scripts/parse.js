// packages
const browserSync = require('browser-sync');
const fs = require('fs-extra');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config.dev');

// internal
const { parallel, series } = require('../utils');
const paths = require('../paths');

// tasks
const api = require('../tasks/api');
const images = require('../tasks/images');
const styles = require('../tasks/styles');
const templates = require('../tasks/templates');
const graphicsMeta = require('../tasks/graphics-meta');

const cleanTemp = async () => {
  await Promise.all([paths.appTmp].map(p => fs.remove(p)));
};

const cleanAppleNews = async () => {
  const pages = await glob('**/index-apple-news.json', {
    absolute: true,
    cwd: paths.appDist,
    recursive: true,
  });
  await Promise.all(pages.map(p => fs.remove(p)));
};

async function runParser() {
  const runner = series([parallel([api, images, styles]), templates]);

  await runner();
  const bs = browserSync.create();
  const bundler = webpack(webpackConfig);
  await bs.init(
    {
      logConnections: true,
      logLevel: 'silent',
      logPrefix: 'data-visuals-create',
      https: process.env.HTTPS === 'true',
      middleware: [
        webpackDevMiddleware(bundler, {
          logLevel: 'silent',
          publicPath: webpackConfig.output.publicPath,
          stats: { colors: true },
        }),
      ],
      notify: false,
      open: false,
      port: 3000,
      server: {
        baseDir: ['./.tmp', './app'],
        routes: {
          '/node_modules': 'node_modules',
        },
      },
    },
    async () => {
      await cleanAppleNews();
      await graphicsMeta(bs.getOption('urls').get('local')).catch(e => {
        console.warn(
          `Did not generate project metadata and screenshots:\n\n${e}`
        );
      });
      bs.exit();
      await cleanTemp();
      process.exit();
    }
  );
}

runParser().catch(console.error);
