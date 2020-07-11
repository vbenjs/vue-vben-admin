const { merge } = require('webpack-merge');
const configVueLoader = (config) => {
  config.module
    .rule('vue')
    .use('vue-loader')
    .loader('vue-loader')
    .tap((options) =>
      merge(options, {
        compilerOptions: {
          preserveWhitespace: true,
        },
      })
    )
    .end();
};

module.exports = {
  configVueLoader,
};
