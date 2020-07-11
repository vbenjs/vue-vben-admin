const { configPolyfill } = require('./polyfill');

const { getEnvFn } = require('../../build/utils');

function configEntry(config) {
  const entry = ['./src/main.ts'];
  config.entry = configPolyfill(entry);

  const { VUE_APP_USE_MOCK } = getEnvFn();
  // use mock
  if (VUE_APP_USE_MOCK === 'TRUE') {
    config.entry.unshift('./mock/_util/mock.config.js');
  }
}

module.exports = {
  configEntry,
};
