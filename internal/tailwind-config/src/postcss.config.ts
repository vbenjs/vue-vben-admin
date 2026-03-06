export default {
  plugins: {
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
    'postcss-antd-fixes': { prefixes: ['ant', 'el'] },
  },
};
