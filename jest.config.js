module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    '^config/(.*)$': '<rootDir>/src/config/$1',
  },
};
