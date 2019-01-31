const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  entry: './src/menestrel.js',
  output: {
    filename: 'menestrel.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
