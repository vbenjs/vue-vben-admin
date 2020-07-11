module.exports = function () {
  return {
    plugins: [
      require('./babel-sugar-inject-h'),
      require('./babel-sugar-setup-functional'),
      require('./babel-sugar-setup-ref'),
      require('./babel-sugar-v-model-v1.1.2-patch'),
    ],
  };
};
