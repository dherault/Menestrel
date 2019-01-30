const path = require('path');

module.exports = {
  mode: 'development',
  entry: './menestrel.js',
  output: {
    filename: 'menestrel.min.js',
    path: __dirname
  }
};
