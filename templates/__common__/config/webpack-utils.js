// native
const path = require('path');

// packages
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const colors = require('ansi-colors');
const glob = require('fast-glob');
const stripAnsi = require('strip-ansi');
const table = require('text-table');
const webpack = require('webpack');

// internal
const paths = require('./paths');
const { nodeEnv } = require('./env');

const jsRegex = /\.(mjs|js|jsx|ts|tsx)$/;
const jsRegexDependencies = /\.(mjs|js)$/;
const jsxPragma = 'h';

const getEntryPacks = ({ esModules = false } = {}) => {
  const entryPacks = glob.sync('*.(js|jsx|ts|tsx)', {
    absolute: true,
    cwd: paths.appScriptPacks,
  });

  const packs = entryPacks.reduce((acc, curr) => {
    const { name } = path.parse(curr);
    acc[name] = [
      esModules ? paths.appModernPolyfills : paths.appLegacyPolyfills,
      curr,
    ];

    return acc;
  }, {});

  return packs;
};

const configureBabelLoader = ({ esModules = false }) => {
  const presetEnvOptions = {
    modules: false,
    exclude: ['transform-regenerator', 'transform-async-to-generator'],
    ignoreBrowserslistConfig: true,
    targets: esModules ? { esmodules: true } : { ie: '11' },
    useBuiltIns: false,
  };

  return {
    test: jsRegex,
    include: path.join(paths.appSrc, 'scripts'),
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', presetEnvOptions],
        ['@babel/preset-typescript', { jsxPragma }],
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        ['@babel/plugin-transform-react-jsx', { pragma: jsxPragma }],
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false,
            helpers: true,
            regenerator: false,
            useESModules: true,
          },
        ],
        !esModules && ['module:fast-async', { spec: true }],
        'babel-plugin-macros',
      ].filter(Boolean),
      cacheDirectory: true,
    },
  };
};

const configureBabelDependenciesLoader = ({ esModules = false }) => {
  const presetEnvOptions = {
    modules: false,
    exclude: ['transform-regenerator', 'transform-async-to-generator'],
    ignoreBrowserslistConfig: true,
    targets: esModules ? { esmodules: true } : { ie: '11' },
    useBuiltIns: false,
  };

  return {
    test: jsRegexDependencies,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: 'babel-loader',
    options: {
      sourceType: 'unambiguous',
      presets: [['@babel/preset-env', presetEnvOptions]],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false,
            helpers: true,
            regenerator: false,
            useESModules: true,
          },
        ],
      ],
    },
  };
};

const isEslintError = message => {
  if (message.fatal || message.severity === 2) {
    return true;
  }
  return false;
};

const eslintFormatter = results => {
  let output = '\n';
  let hasErrors = false;

  results.forEach(result => {
    let messages = result.messages;
    if (messages.length === 0) {
      return;
    }

    messages = messages.map(message => {
      let messageType;
      if (isEslintError(message)) {
        messageType = 'error';
        hasErrors = true;
      } else {
        messageType = 'warn';
      }

      let line = message.line || 0;
      if (message.column) {
        line += ':' + message.column;
      }
      let position = colors.bold('Line ' + line + ':');
      return [
        '',
        position,
        messageType,
        message.message.replace(/\.$/, ''),
        colors.underline(message.ruleId || ''),
      ];
    });

    // if there are error messages, we want to show only errors
    if (hasErrors) {
      messages = messages.filter(m => m[2] === 'error');
    }

    // add color to rule keywords
    messages.forEach(m => {
      m[4] = m[2] === 'error' ? colors.yellow(m[4]) : colors.yellow(m[4]);
      m.splice(2, 1);
    });

    let outputTable = table(messages, {
      align: ['l', 'l', 'l'],
      stringLength(str) {
        return stripAnsi(str).length;
      },
    });

    output += `${outputTable}\n\n`;
  });

  return output;
};

const generateBaseConfig = ({ PROJECT_URL, esModules = false }) => {
  return {
    entry: {
      ...getEntryPacks({ esModules }),
    },
    resolve: {
      alias: {
        Assets: paths.appAssets,
        Data: paths.appData,
        react: 'preact-compat',
        'react-dom': 'preact-compat',
      },
      extensions: ['.wasm', '.mjs', '.js', '.json', '.ts', '.tsx'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.(mjs|js|jsx)$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          include: paths.appScripts,
          options: {
            formatter: eslintFormatter,
            emitWarning: true,
          },
        },
        {
          oneOf: [
            configureBabelLoader({ esModules }),
            configureBabelDependenciesLoader({ esModules }),
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
        'process.env.PUBLIC_PATH': JSON.stringify(PROJECT_URL),
      }),
      new CaseSensitivePathsPlugin(),
    ],
    node: {
      __dirname: false,
      __filename: false,
      Buffer: false,
      console: false,
      fs: 'empty',
      net: 'empty',
      process: false,
      setImmediate: false,
      tls: 'empty',
    },
  };
};

module.exports = { generateBaseConfig };
