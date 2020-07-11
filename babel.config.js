const { isProductionFn } = require('./build/utils');

const plugins = [];

if (isProductionFn() && process.env.BUILD_ON_CLEAN_CONSOLE === 'TRUE') {
  plugins.push('transform-remove-console');
} else {
  plugins.push([
    'captains-log',
    {
      injectVariableName: true,
      injectFileName: false,
      ignorePatterns: [
        'node_modules',
        'build',
        'config',
        'mock',
        'dist',
        'docs',
        'public',
        '.spec.js',
      ],
    },
  ]);
}
module.exports = (api) => {
  return {
    plugins: [
      '@vue/babel-plugin-transform-vue-jsx',
      [
        'babel-plugin-component',
        {
          libraryName: '@ylz/ele-ui',
          styleLibraryName: 'theme-chalk',
        },
      ],
      [
        'babel-plugin-import',
        { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true },
        'ant-design-vue',
      ],
      ...plugins,
    ],
    presets: [
      require('./build/lib/jsx/index.js'),
      // 'babel-preset-vca-jsx',
      [
        '@vue/cli-plugin-babel/preset',
        {
          // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
          modules: false,
          // browserslist环境不支持的所有垫片都导入
          useBuiltIns: 'entry',
          corejs: { version: 3, proposals: true },
          forceAllTransforms: api.env('production'),
          targets: {
            chrome: '58',
            ie: '9',
          },
        },
      ],
    ],
  };
};
