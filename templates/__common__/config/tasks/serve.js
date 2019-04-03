// native
const path = require('path');

// packages
const browserSync = require('browser-sync');
const colors = require('ansi-colors');
const formatMessages = require('webpack-format-messages');
const watch = require('glob-watcher');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

// internal
const paths = require('../paths');
const styles = require('./styles');
const templates = require('./templates');
const {
  clearConsole,
  logErrorMessage,
  printInstructions,
} = require('../utils');
const webpackConfig = require('../webpack.config.dev');

module.exports = () => {
  // create the browser-sync client
  const bs = browserSync.create();

  // prep the webpack bundle
  const bundler = webpack(webpackConfig);

  bs.init(
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
    async err => {
      // if browser-sync failed to start up, hard stop here
      if (err) return console.error(err);

      // track whether errors or warnings already exist on other compiles
      let templatesError = null;
      let stylesError = null;
      let scriptsError = null;
      let scriptsWarning = null;

      console.log(colors.yellow('Starting initial serve...'));

      const urls = bs.getOption('urls');

      const local = urls.get('local');
      const external = urls.get('external');

      const onError = (type, err) => {
        console.log(colors.red(`${type} failed to compile.\n`));
        logErrorMessage(err);
      };

      const onWarning = (type, err) => {
        console.log(colors.yellow(`${type} compiled with warnings.\n`));
        logErrorMessage(err);
      };

      const logStatus = () => {
        clearConsole();

        let hadError = false;

        if (templatesError) {
          hadError = true;
          onError('Templates', templatesError);
        }

        if (stylesError) {
          hadError = true;
          onError('Styles', stylesError);
        }

        if (scriptsError) {
          hadError = true;
          onError('Scripts', scriptsError);
        }

        if (scriptsWarning && scriptsError == null) {
          onWarning('Scripts', scriptsWarning);
        }

        if (!hadError) {
          console.log(colors.green('Project compiled successfully!'));
          printInstructions({ local, external });
        }
      };

      const compileTemplates = async () => {
        try {
          await templates();

          // if browsersync is running, reload it
          if (bs.active) {
            bs.reload();
          }

          templatesError = null;
        } catch (err) {
          templatesError = err;
        }

        logStatus();
      };

      const compileStyles = async () => {
        try {
          const paths = await styles();

          // if browsersync is active, reload it
          if (bs.active) {
            paths.forEach(({ relativePath }) => bs.reload(relativePath));
          }

          stylesError = null;
        } catch (err) {
          stylesError = err;
        }

        logStatus();
      };

      // initial compile of templates
      await compileTemplates();

      // template watching
      watch(
        [
          path.join(paths.appSrc, '**/*.html'),
          path.join(paths.appData, '*.json'),
        ],
        compileTemplates
      );

      // initial compile of styles
      await compileStyles();

      // styles watching
      watch([path.join(paths.appStyles, '/**/*.scss')], compileStyles);

      // scripts watching
      bundler.hooks.done.tap('done', stats => {
        const messages = formatMessages(stats);

        clearConsole();

        // no errors or warnings, good to go
        if (!messages.errors.length && !messages.warnings.length) {
          bs.reload();

          scriptsError = null;
          scriptsWarning = null;

          logStatus();
        }

        // there are errors
        if (messages.errors.length) {
          scriptsError = messages.errors.join('\n\n');

          logStatus();
          return;
        }

        // there are warnings
        if (messages.warnings.length) {
          scriptsError = null;
          scriptsWarning = messages.warnings.join('\n\n');

          logStatus();

          bs.reload();
        }
      });
    }
  );
};
