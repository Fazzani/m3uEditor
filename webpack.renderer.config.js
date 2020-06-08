const rules = require('./webpack.rules');
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
      'react-dom': '@hot-loader/react-dom',
    },
  },
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: plugins,
};
