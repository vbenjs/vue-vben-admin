/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('windicss/colors');
const defaultTheme = require('windicss/defaultTheme');
module.exports = {
  darkMode: 'class',
  plugins: [
    require('windicss/plugin/forms'),
    require('windicss/plugin/typography'),
    require('windicss/plugin/line-clamp'),
    require('windicss/plugin/aspect-ratio'),
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Righteous', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
