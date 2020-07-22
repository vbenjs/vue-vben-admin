const { merge } = require('webpack-merge');

const configDefinePlugin = (config) => {
  config.plugin('define').tap((args) => {
    // Incorporate dynamic configuration into process.env
    const name = 'process.env';
    const ENV = process.env;
    const conf = {};
    Object.keys(ENV).forEach((key) => {
      if (/^(GLOB_)/.test(key)) {
        conf[key] = JSON.stringify(ENV[key]);
      }
    });
    args[0][name] = merge(args[0][name], conf);
    return args;
  });
};
module.exports = {
  configDefinePlugin,
};
