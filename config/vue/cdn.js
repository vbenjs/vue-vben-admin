const { isProductionFn, getEnvFn } = require('../../build/utils');

const CDN = {
  css: [
    '//cdn.bootcdn.net/ajax/libs/normalize/8.0.1/normalize.min.css',
    '//cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.css',
  ],
  js: [
    '//cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js',
    '//cdn.bootcdn.net/ajax/libs/vue-router/3.2.0/vue-router.min.js',
    '//cdn.bootcdn.net/ajax/libs/vuex/3.5.1/vuex.min.js',
    '//cdn.bootcdn.net/ajax/libs/axios/0.19.2/axios.min.js',
    '//cdn.bootcdn.net/ajax/libs/qs/6.9.4/qs.min.js',
    '//cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.js',
    '//cdn.bootcdn.net/ajax/libs/lodash.js/4.17.15/lodash.min.js',
    '//cdn.bootcdn.net/ajax/libs/crypto-js/3.3.0/crypto-js.min.js',
    '//cdn.bootcdn.net/ajax/libs/vue-i18n/8.18.1/vue-i18n.min.js',
    // '//cdn.bootcdn.net/ajax/libs/echarts/4.8.0/echarts.min.js',
    // '//cdn.bootcss.com/Mock.js/1.0.1-beta3/mock-min.js',
  ],
};
function configCdn(config) {
  const ENV = getEnvFn();
  config.when(isProductionFn() && ENV.VUE_APP_USE_CDN === 'TRUE', (config) => {
    config.externals({
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      qs: 'qs',
      lodash: '_',
      nprogress: 'NProgress',
      'crypto-js': 'CryptoJS',
      'vue-i18n': 'VueI18n',
      // echarts: 'echarts',
      // mockjs: 'Mock',
    });

    config.plugin('html').tap((args) => {
      args[0].cdn = CDN;
      return args;
    });
  });
}

module.exports = {
  configCdn,
};
