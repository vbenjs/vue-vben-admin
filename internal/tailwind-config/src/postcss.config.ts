import config from '.';

export default {
  plugins: {
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
    // Specifying the config is not necessary in most cases, but it is included
    autoprefixer: {},
    // 修复 element-plus 和 ant-design-vue 的样式和tailwindcss冲突问题
    'postcss-antd-fixes': { prefixes: ['ant', 'el'] },
    'postcss-preset-env': {},
    // here to share the same config across the entire monorepo
    tailwindcss: { config },
  },
};
