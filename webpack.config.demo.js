const path = require('path');

module.exports = {
  mode: 'development',
  entry: './demo/demo.js',
  output: {
    filename: 'demo.min.js',
    path: path.resolve(__dirname, 'demo'),
  },
};
