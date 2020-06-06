const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');

module.exports = [
  new webpack.ExternalsPlugin('commonjs', [
            'electron'
        ]),
  new ForkTsCheckerWebpackPlugin({
    async: false,
  }),
];
