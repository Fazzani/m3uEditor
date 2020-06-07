const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  new webpack.ExternalsPlugin('commonjs', ['electron']),
  new ForkTsCheckerWebpackPlugin({
    async: false,
  }),
  new CopyPlugin({
    patterns: [{ from: './src/assets/img', to: 'assets' }],
  }),
];
