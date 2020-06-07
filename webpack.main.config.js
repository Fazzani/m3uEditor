const plugins = require('./webpack.plugins');
module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.png', '.jpg'],
  },
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: plugins,
};
