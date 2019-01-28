const path = require('path');

module.exports = {
  mode: 'development',
  entry: './menestrel.js',
  output: {
    filename: 'menestrel.min.js',
    path: path.resolve(__dirname, 'dist')
  }
};
