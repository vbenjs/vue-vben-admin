import messages from 'globby!/@/locales/**/*.json';

// import { camelCase } from 'lodash-es';

// const requireModule = import('/@/locales');
//
// interface LooseObject {
//   [key: string]: any;
// }
//
// const api: LooseObject = {};
//
// requireModule.keys().forEach((fileName) => {
//   if (fileName === './index.ts') return;
//   const moduleName = camelCase(fileName.replace(/(\.\/|\.ts)/g, ''));
//   console.log(moduleName);
//   api[moduleName] = {
//     ...requireModule(fileName).default,
//   };
// });

// Object.keys(messages).forEach((key) => {
//   console.log(key);
// });

const localeMessages = {
  ...messages,
};

export default localeMessages;
