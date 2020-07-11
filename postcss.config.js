module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes')({
      remove: false,
    }),
    require('autoprefixer')({
      remove: false,
    }),
  ],
};
