const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const paths = require('./paths');

const NODE_ENV = process.env.NODE_ENV;

const config = {
  devtool: 'cheap-module-source-map',
  context: path.join(paths.appSrc, 'scripts'),
  entry: {
    main: [paths.appPolyfills, paths.appMain],
  },
  output: {
    path: path.join(paths.appDist, 'scripts'),
    pathinfo: true,
    publicPath: '/scripts/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].chunk.js',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath),
  },
  resolve: {
    alias: {
      'app-entrypoint': paths.appMain,
    },
    extensions: ['.js', '.json', '.jsx'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(js|jsx)$/,
        include: path.join(paths.appSrc, 'scripts'),
        loader: 'babel-loader',
        query: {
          presets: [['babel-preset-env', { modules: false }]],
          plugins: [
            'babel-plugin-syntax-dynamic-import',
            [
              'babel-plugin-transform-es2015-classes',
              {
                loose: true,
              },
            ],
            ['babel-plugin-transform-react-jsx', { pragma: 'h' }],
          ],
        },
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
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

if (NODE_ENV === 'development') {
  config.plugins.push(new webpack.NamedModulesPlugin());
}

module.exports = config;
