const css = ['//cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.css'];

// TODO use esm?
const js = [
  '//cdn.bootcdn.net/ajax/libs/vue/3.0.0/vue.global.prod.js',
  '//cdn.bootcdn.net/ajax/libs/vue-router/4.0.0-beta.13/vue-router.global.min.js',
  '//cdn.bootcdn.net/ajax/libs/vuex/4.0.0-beta.4/vuex.global.prod.js',
  '//cdn.bootcdn.net/ajax/libs/axios/0.19.2/axios.min.js',
  '//cdn.bootcdn.net/ajax/libs/qs/6.9.4/qs.min.js',
  '//cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.js',
  // '//cdn.bootcdn.net/ajax/libs/lodash.js/4.17.15/lodash.min.js',
  // '//cdn.bootcdn.net/ajax/libs/crypto-js/3.3.0/crypto-js.min.js',
  // '//cdn.bootcdn.net/ajax/libs/vue-i18n/8.18.1/vue-i18n.min.js',
];

export const externals = ['vue', 'vuex', 'vue-router', 'axios', 'qs', 'nprogress'];

export const cdnConf = {
  css,
  js,
};
