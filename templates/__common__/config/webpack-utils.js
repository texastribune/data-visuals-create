// native
const path = require('path');

// packages
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const glob = require('fast-glob');
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
