<p align="center">
  <a href="https://github.com/anncwb/vue-vben-admin" target="_blank">
    <img alt="VbenAdmin Logo" width="200" src="./docs/imgs/logo.png">
  </a>
</p>
<h2 align="center">VUE VBEN ADMIN</h2>

**中文** | [English](./README-ES.md)

一个适合开发中大型项目的基础框架，需要对`vue`,`typescript`有一定的了解,也可以作为了解新写法的一个例子来看，提前适应后续新版本的开发方式

项目基于`ant-design-vue`,`typescript`,`vue-composition-api`,`TSX`实现的 vue3 风格的后台管理系统，

兼容 vue2 的浏览器，一切免费，不收取任何费用，请放心使用。后续定期提供更新及维护，可供参考与学习

### 在线示例

[在线预览](https://vvbin.cn/)

<p align="center">
    <img alt="VbenAdmin Logo" width="100%" src="./docs/imgs/preview1.png">
    <img alt="VbenAdmin Logo" width="100%" src="./docs/imgs/preview2.png">
    <img alt="VbenAdmin Logo" width="100%" src="./docs/imgs/preview3.png">
</p>

### gitHub 地址

[vue-vben-admin](https://github.com/anncwb/vue-vben-admin)

### 文档

文档未完全写完，还在陆续编写中...

[在线文档](https://vvbin.cn/docs/)

### 为什么写这个

目前在网上暂时没有找到相关的使用`composition-api`+`typescript` 写的后台系统，所以就把自己写的分享出来，后续会陆续加上新的功能，并且等`vue3`完全稳定的时候,会提供`vue3`版本，该项目后续切换 `vue3` 的成本相对较低，后续会做成一键版本切换

### 为什么要使用 vue-composition-api

最大的原因是我们还要兼容 `ie11`，`ie9`和`ie10` 可能需要自己修改 css 兼容性和部分插件的兼容性， `vue3`稳定下来最多也就支持`ie11`,所以暂时使用了`vue-composition-api`进行开发

## 使用到的技术

- vue2.6.11(后续提供 vue3 版本)
- composition-api:
- vuex@3.4.0
- vuex-module-decorators
- vue-router@3.3.4
- axios@0.19.2
- ant-design-vue@1.6.3
- mockjs
- vue-i18n
- moment
- lodash

[更新日志](CHANGELOG.md)

- [使用到的技术](#使用到的技术)
- [环境要求](#环境要求)
  - [建议开发环境](#建议开发环境)
- [浏览器支持](#浏览器支持)
- [安装](#安装)
- [命令参考(Terminal)](#命令参考terminal)
  - [启动开发环境](#启动开发环境)
  - [打包](#打包)
  - [单元测试](#单元测试)
  - [格式化](#格式化)
  - [其他](#其他)
- [Git 提交规范](#git-提交规范)
  - [目录结构](#目录结构)
- [代码贡献](#代码贡献)
- [开发计划](#开发计划)
- [加入我们](#加入我们)
-

## 环境要求

- `Node.js`: >= v10
- `yarn`: 最新

### 建议开发环境

- `Git`: 最新 代码管理
- `Visual Studio Code` (VSCode): 最新 IDE

VSCode 插件

- `Vetur`: vue 开发必备
- `GitLens`: Git 可视化工具
- `ESLint`: 脚本代码检查
- `stylelint`: 样式代码检查
- `Prettier - Code formatter`:代码格式化

## 浏览器支持

支持现代浏览器及 IE10+

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## 安装

```js
git config core.ignorecase false # 使git对文件名大小写敏感

// 拉取项目代码

git clone https://github.com/anncwb/vue-vben-admin.git

cd vue-vben-admin

//  最好使用yarn，否则热更新可能出现问题
yarn install

```

## 命令参考(Terminal)

### 启动开发环境

```bash
yarn serve
```

### 打包

同时会生成文件名 `window-glob.js` 配置文件，项目配置可以动态修改该文件实时更新代码变量，比如接口地址

```bash

yarn build # 打包 会使用hardSource进行打包

yarn build:no-cache # 打包 不会使用hardSource进行打包

yarn report # 生成构建包表表预览
```

### 单元测试

```bash
yarn test:unit # --watch : 跟踪文件变化
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
  - `mod` 不确定分类的修改
  - `wip` 删除文件

### 目录结构

```bash
├── build # 构建任务相关
├── dist # 生成的部署文件目录
├── public # 静态文件目录
├── mock # 模拟数据目录
├── config # 项目构建配置文件
├── src # 源码目录
│   │── api # 接口
│   │── assets # 静态资源文件目录, 使用到的会被解析处理(比如图片等)
│   │── components # 提取的复用组件(文件夹分类, 未分类的基本就是基础组件了)
│   │── setting # 配置目录
│   │── enums # 枚举目录
│   │── common # 共用文件目录
│   │── router # 路由及菜单配置
│   │── design # 样式
│   │── hooks # vue3 组合式api
│   │── store # 状态管理
│   │   └── modules # 各模块状态管理
│   │── types # ts 接口/申明文件
│   │── utils # 工具集(业务无关, 一般为幂等函数/单例对象/Class...)
│   │── setup # 项目初始配置
│   └── views视图
├── tests # 测试用例目录
│   └── unit # unit 测试(jest): https://jestjs.io
├── ... # 其他配置文件
└── vue.config.js # 配置入口(vue cli)
```

## 代码贡献

1. Fork 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交`pull request`

## 开发计划

由于开发时间较短，所以功能暂时较少

后续会逐步完善，有需要什么组件可以提出来

- [x] 项目搭建（基于 vue-cli4）已经优化
- [x] 首屏加载等待动画
- [x] 登录和注销
- [x] 菜单（可以搜索及拖拽以及菜单布局）
- [x] 多标签页/面包屑
- [x] 基于角色的权限管理
- [x] 基于后台的权限管理
- [x] 分离的路由和菜单设置
- [x] 可折叠侧边栏
- [x] 可拖拽侧边栏
- [x] 多标签页模式/全局控制
- [x] 支持菜单 svg 图标
- [x] 菜单搜索
- [x] 页面加载 loading/页面超时组件
- [x] 滚动条组件
- [x] 懒加载组件
- [x] 弹窗扩展（可拖拽,全屏,自适应高度）
- [x] 全屏
- [x] 自动注册 SVG 图标
- [x] 模拟数据
- [x] 剪贴板封装
- [x] hook 封装
- [x] 图表库
- [x] 数字动画
- [x] 项目可配置
- [x] 主题配置
- [x] 表单组件
- [x] 右键菜单
- [x] 水印插件
- [x] 视差组件
- [x] 动画组件
- [x] 二维码插件
- [x] 国际化插件
- [x] 图片预览组件
- [x] 详情组件
- [x] 表格组件
- [x] 图片裁剪
- [x] 富文本组件
- [x] 上传组件
- [x] 错误日志
- [x] 拖拽面板
- [x] 验证码/验证组件
- [x] 数据导入导出
- [ ] 树组件
- [ ] 可编辑表格
- [ ] 表格/树功能加强
- [ ] 黑暗主题
- [ ] 界面 ui 升级优化
- [ ] 兼容最新`vuex`,`vue-router`,
- [ ] 搭建`vite`版本
- [ ] 更多组件/功能/建议/bug/欢迎提交 pr 或者 issue

## 加入我们

`VUE-VBEN-ADMIN` 是完全开源免费的项目，旨在帮助开发者更方便地进行中大型管理系统开发，同时也提供 QQ 交流群(项目刚起步，人数较少，有兴趣的可以加群一起讨论)，使用问题欢迎在群内提问。

- QQ 群 `569291866`

 <img alt="VbenAdmin Logo" width="100" src="./docs/imgs/qq.jpeg">
