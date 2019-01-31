const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/menestrel.js',
  output: {
    filename: 'menestrel.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
