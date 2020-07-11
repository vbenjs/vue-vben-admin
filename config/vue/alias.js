const resolve = require('../../build/getCwdPath');

const baseAlias = {
  examples: 'examples',
  config: 'config',
  '#': 'src/types',
  '@': 'src',
  '@ant-design/icons/lib/dist$': 'src/assets/icons/setupIcon.ts',
  '@design': 'src/design/index.less',
  'compatible-vue': 'src/setup/vue/index.ts',
};

function configAlias(config) {
  // 单页应用
  Object.keys(baseAlias).forEach((key) => {
    config.resolve.alias.set(key, resolve(baseAlias[key]));
  });
}
module.exports = {
  configAlias,
};
