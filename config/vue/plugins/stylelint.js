const StyleLintPlugin = require('stylelint-webpack-plugin');

const { isDevFn } = require('../../../build/utils');

function createStyleLintPlugin(config) {
  config.when(isDevFn(), (config) => {
    config.plugin('stylelint').use(StyleLintPlugin, [
      {
        fix: true,
        cache: true,
        lintDirtyModulesOnly: true,
        files: ['**/*.vue', '**/*.less', , '**/*.scss', '**/*.css'],
        cacheLocation: 'node_modules/.cache/stylelint/',
      },
    ]);
  });
}

module.exports = {
  createStyleLintPlugin,
};
