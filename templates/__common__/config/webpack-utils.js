// native
const path = require('path');

// packages
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const glob = require('fast-glob');
const webpack = require('webpack');

// internal
const paths = require('./paths');
const { nodeEnv } = require('./env');

const jsRegex = /\.(js|jsx|ts|tsx)$/;
const jsxPragma = 'h';

const getEntryPacks = ({ includePolyfills = true } = {}) => {
  const entryPacks = glob.sync('*.(js|jsx|ts|tsx)', {
    absolute: true,
    cwd: paths.appScriptPacks,
  });

  const packs = entryPacks.reduce((acc, curr) => {
    const { name } = path.parse(curr);
    acc[name] = [includePolyfills && paths.appPolyfills, curr].filter(Boolean);

    return acc;
  }, {});

  return packs;
};

const configureBabelLoader = () => {
  return {
    test: jsRegex,
    include: path.join(paths.appSrc, 'scripts'),
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
        ['@babel/preset-typescript', { jsxPragma }],
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-transform-react-jsx', { pragma: jsxPragma }],
        [
          '@babel/plugin-transform-runtime',
          { regenerator: false, useESModules: true },
        ],
        'babel-plugin-macros',
      ],
      cacheDirectory: true,
    },
  };
};

const generateBaseConfig = ({ PROJECT_URL }) => {
  return {
    entry: {
      ...getEntryPacks(),
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
      rules: [{ parser: { requireEnsure: false } }, configureBabelLoader()],
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
