const plugins = require('./webpack.plugins');
const path = require('path');

function srcPaths(src) {
  return path.join(__dirname, src);
}

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', 'json'],
    alias: {
      '@main': srcPaths('src/main'),
      '@models': srcPaths('src/models'),
      '@renderer': srcPaths('src/renderer'),
      '@components': srcPaths('src/components'),
      '@native-ui': srcPaths('src/native-ui'),
    },
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
