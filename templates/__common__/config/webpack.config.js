const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const glob = require('fast-glob');
const path = require('path');
const webpack = require('webpack');

const paths = require('./paths');

const PROJECT_URL = '/';
const NODE_ENV = process.env.NODE_ENV;

const entryPacks = glob.sync('*.js', {
  absolute: true,
  cwd: paths.appScriptPacks,
});

const packs = entryPacks.reduce((acc, curr) => {
  const { name } = path.parse(curr);
  acc[name] = curr;

  return acc;
}, {});

const config = {
  devtool: 'cheap-module-source-map',
  context: path.join(paths.appSrc, 'scripts'),
  entry: {
    ...packs,
    vendor: paths.appPolyfills,
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
      Assets: paths.appAssets,
      Data: paths.appData,
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
        options: {
          presets: [['@babel/preset-env', { modules: false }]],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-classes',
              {
                loose: true,
              },
            ],
            ['@babel/plugin-transform-react-jsx', { pragma: 'h' }],
          ],
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      // A name of the chunk that will include the dependencies.
      // This name is substituted in place of [name] from step 1
      name: 'vendor',

      // A function that determines which modules to include into this chunk
      minChunks: module =>
        module.context && module.context.includes('node_modules'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      // minChunks: Infinity means that no app modules
      // will be included into this chunk
      minChunks: Infinity,
    }),
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
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        PUBLIC_PATH: JSON.stringify(PROJECT_URL),
      },
    })
  );
}

module.exports = config;
