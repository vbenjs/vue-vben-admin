"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine = require('./engine');
exports.default = engine({
    types: {
        feat: {
            description: '🌟  一个新功能',
            title: '🌟 新功能',
        },
        update: {
            description: '✅ 更新某个模块,跟fix和feat不一样',
            title: '✅  更新',
        },
        fix: {
            description: '🐛  一个 bug 修复',
            title: '🐛 Bug 修复',
        },
        style: {
            description: '🎨  对代码含义无影响的改动（空格，格式化，等，非 UI 变动）',
            title: '🎨 代码样式',
        },
        chore: {
            description: '🏠  影响构建系统或外部依赖的更改（例如：gulp，npm，webpack）',
            title: '🏠 构建',
        },
        docs: {
            description: '📝  只有文档发生改变',
            title: '📝 文档',
        },
        build: {
            description: '🎉 修改项目构建系统(如 glup，webpack，rollup 的配置等)的提交',
            title: '🎉  项目构建',
        },
        refactor: {
            description: '♻️  既不是修复 bug 也不是添加新功能的代码更改',
            title: '♻️ 代码重构',
        },
        perf: {
            description: '🚀  提升性能的代码更改',
            title: '🚀 性能优化',
        },
        test: {
            description: '🔧  添加一些缺失的测试或者修正已存在的测试',
            title: '🔧 测试',
        },
        ci: {
            description: '📦  持续集成的配置文件和脚本的改变（例如: Travis, Circle）',
            title: '📦 持续集成',
        },
        revert: {
            description: '⏪  撤销上一次的提交',
            title: '⏪ 撤销',
        },
        wip: {
            description: '🔒  删除某些文件',
            title: '🔒 删除',
        },
    },
    scopes: {
        global: {
            description: '影响整个项目',
            title: 'global',
        },
        ui: {
            description: 'UI 界面',
            title: 'ui',
        },
        data: {
            description: '数据变化',
            title: 'data',
        },
        component: {
            description: '影响公共组件使用',
            title: 'component',
        },
        build: {
            description: '影响构建',
            title: 'build',
        },
        unknown: {
            description: '不知道影响范围',
            title: 'unknown',
        },
    },
});
module.exports = exports.default;
