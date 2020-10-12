// js调用cli 兼容调用ts

const { sh } = require('tasksfile');
const { argv } = require('yargs');

let command = ``;

Object.keys(argv).forEach((key) => {
  if (!/^\$/.test(key) && key !== '_') {
    // @ts-ignore
    if (argv[key]) {
      command += `--${key} `;
    }
  }
});

// 执行任务名称
let taskList = argv._;

let NODE_ENV = process.env.NODE_ENV || 'development';

if (taskList.includes('build') || taskList.includes('report') || taskList.includes('preview')) {
  NODE_ENV = 'production';
}

if (taskList && Array.isArray(taskList) && taskList.length) {
  sh(
    `cross-env NODE_ENV=${NODE_ENV} ts-node --project  ./build/tsconfig.json ./build/script/cli.ts ${taskList.join(
      ' '
    )} ${command}`,
    {
      async: true,
      nopipe: true,
    }
  );
}
