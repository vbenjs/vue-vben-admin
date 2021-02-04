<p align="center">
  <a href="https://github.com/anncwb/vue-vben-admin" target="_blank">
    <img alt="VbenAdmin Logo" width="200" src="./.github/res/imgs/logo.png">
  </a>
</p>
<h2 align="center">VUE VBEN ADMIN2.0</h2>

**中文** | [English](./README.md)

[更新日志](CHANGELOG.zh_CN.md)

- [介绍](#介绍)
- [gitHub 地址](#github-地址)
  - [精简版地址](#精简版地址)
- [预览地址](#预览地址)
- [文档](#文档)
- [预安装](#预安装)
  - [环境要求](#环境要求)
  - [UI 框架](#ui-框架)
  - [图标](#图标)
  - [插件](#插件)
  - [建议开发环境](#建议开发环境)
- [安装](#安装)
- [使用](#使用)
  - [开发环境](#开发环境)
  - [打包](#打包)
  - [格式化](#格式化)
  - [其他](#其他)
- [Git 提交规范](#git-提交规范)
- [代码贡献](#代码贡献)
- [已完成功能](#已完成功能)
- [正在开发的功能](#正在开发的功能)
- [浏览器支持](#浏览器支持)
- [插件](#插件-1)
- [加入我们](#加入我们)

## 介绍

项目基于`ant-design-vue`,`typescript`,`vue3.0`,`vite`,`tsx`实现的 vue3 风格的后台管理系统，

## gitHub 地址

[vue-vben-admin2.0](https://github.com/anncwb/vue-vben-admin) - `main` 分支

### 精简版地址

[vue-vben-admin-thin-next](https://github.com/anncwb/vben-admin-thin-next)

## 预览地址

- [2.0 在线预览](https://vvbin.cn/next/)

- [2.0 精简版 在线预览](https://vvbin.cn/thin/next/)

测试账号: vben/123456

<p align="center">
    <img alt="VbenAdmin Logo" width="100%" src="./.github/res/imgs/preview1.png">
    <img alt="VbenAdmin Logo" width="100%" src="./.github/res/imgs/preview2.png">
    <img alt="VbenAdmin Logo" width="100%" src="./.github/res/imgs/preview3.png">
</p>

## 文档

[文档地址,持续更新中。。，](https://vvbin.cn/doc-next/)

## 预安装

### 环境要求

- `Node.js`: - 版本大于 `12.0.0`
- `yarn` : - 包管理工具.

### UI 框架

- [Tailwind CSS](https://tailwindcss.com/) - 2.0.0-beta.5 已删除
- [Ant Design Vue 2.0](https://2x.antdv.com/docs/vue/introduce-cn/)

### 图标

- [Ant Design Vue Icon Component](https://2x.antdv.com/components/icon-cn/) - 按需引入所需图标.
- [Iconify](https://iconify.design) - 使用任何图标集中的图标 [Icônes](https://icones.netlify.app/)
- [PurgeIcons](https://github.com/antfu/purge-icons) - 仅打包所使用到的图标.

### 插件

- [Vue Router Next](https://github.com/vuejs/vue-router-next)
- [Vuex Next](https://github.com/vuejs/vuex)
- [vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators) - vuex 模块化
- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) - 基于 vite 的 mock 插件.
- [vue-i18n](https://github.com/intlify/vue-i18n-next) - 国际化
- [lodash-es](https://github.com/lodash/lodash) - JavaScript 实用程序库
- [axios](https://github.com/axios/axios) - Http 数据交互
- [TypeScript](https://www.typescriptlang.org/)

### 建议开发环境

- `Git`: - 版本管理工具
- `Visual Studio Code` - (VSCode): 最新版本
  - [VS Code Extensions](./.vscode/extensions.json)
    - [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)
    - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Tailwind Css 样式联想
    - [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) - vue 开发必备
    - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 脚本代码检查
    - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 代码格式化
    - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - css 格式化

## 安装

```js
//  使git对文件名大小写敏感
git config core.ignorecase false

// 拉取项目代码

git clone https://github.com/anncwb/vue-vben-admin.git vue-vben-admin-2.0

cd vue-vben-admin-2.0

// 如果使用别的包管理工具，可以自行安装
// 如果未安装yarn，请运行：npm install -g yarn
yarn install

```

## 使用

### 开发环境

```bash
yarn serve
```

### 打包

```bash

yarn build # 打包

yarn build:no-cache # 打包，执行之前会先删除缓存

yarn report # 生成构建包报表预览
```

### 格式化

```bash
yarn lint:stylelint # 样式格式化

yarn lint:prettier # js/ts代码格式化
```

### 其他

```bash
yarn reinstall # 删除依赖重新装，兼容window

yarn preview # 本地进行打包预览

yarn log # 生成CHANGELOG

yarn clean:cache # 删除缓存

yarn clean:lib # 删除node_modules，兼容window系统
```

## Git 提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 代码贡献

1. Fork 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交`pull request`

## 已完成功能

- [x] 项目搭建（基于 vite）
- [x] 登录和注销
- [x] 菜单（可以搜索及拖拽以及菜单布局）
- [x] 多标签页/面包屑
- [x] 基于角色的权限管理
- [x] 基于后台的权限管理
- [x] 分离的路由和菜单设置
- [x] 可折叠侧边栏
- [x] 可拖拽侧边栏
- [x] 多标签页模式/全局控制
- [x] 菜单搜索
- [x] 页面加载 loading
- [x] 滚动条组件
- [x] 弹窗扩展（可拖拽,全屏,自适应高度）
- [x] 模拟数据
- [x] hook 封装
- [x] 表单组件
- [x] 右键菜单
- [x] 水印插件
- [x] 动画组件
- [x] 二维码插件
- [x] 国际化插件
- [x] 详情组件
- [x] 验证组件
- [x] 树组件
- [x] 图片预览组件
- [x] 表格组件
- [x] 图表库
- [x] 数字动画
- [x] 首屏加载等待动画
- [x] 抽取生产环境配置文件
- [x] 打包 Gzip
- [x] 数据导入导出
- [x] 系统性能优化
- [x] 全局错误处理
- [x] 富文本组件
- [x] 上传组件
- [x] 多语言支持

## 正在开发的功能

- [ ] 主题配置
- [ ] 黑暗主题
- [ ] 打包 CDN

更多组件/功能/建议/bug/欢迎提交 pr 或者 issue

## 浏览器支持

本地开发推荐使用`Chrome`浏览器,在火狐浏览器进行开发相对卡顿。

支持现代浏览器, IE 暂不支持，后续考虑支持 ie11

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

更多浏览器可以查看 [Can I Use Es Module](https://caniuse.com/?search=ES%20Module)

## 插件

如果这些插件对你有帮助，可以给一个 star 支持下

- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock)
- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html)
- [vite-plugin-style-import](https://github.com/anncwb/vite-plugin-style-import)
- [vite-plugin-theme](https://github.com/anncwb/vite-plugin-theme)
- [vite-plugin-imagemin](https://github.com/anncwb/vite-plugin-imagemin)

## 加入我们

`Vue-Vben-Aadmin` 是完全开源免费的项目，在帮助开发者更方便地进行中大型管理系统开发，同时也提供 QQ 交流群(项目刚起步，人数较少，有兴趣的可以加群一起讨论)，使用问题欢迎在群内提问。

- QQ 群 `569291866`

 <img alt="VbenAdmin Logo" width="100" src="./.github/res/imgs/qq.jpeg">
