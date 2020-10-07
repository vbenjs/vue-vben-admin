<p align="center">
  <a href="https://github.com/anncwb/vue-vben-admin" target="_blank">
    <img alt="VbenAdmin Logo" width="200" src="./docs/imgs/logo.png">
  </a>
</p>
<h2 align="center">VUE VBEN ADMIN</h2>

**中文**

该分支为 2.0 新分支，使用 vue3 进行开发。

1.0 分支请切换到`master`分支。1.0 采用`vue2.6`+`vue-composition-api`+`vue-cli`开发

一个适合开发中大型项目的基础框架，需要对`vue`,`typescript`有一定的了解,也可以作为了解新写法的一个例子来看，提前适应后续新版本的开发方式

项目基于`ant-design-vue`,`typescript`,`vue3.0`,`vite`,`tailwindcss`,`tsx`实现的 vue3 风格的后台管理系统，

### gitHub 地址

[vue-vben-admin2.0](https://github.com/anncwb/vue-vben-admin)

<p align="center">
    <img alt="VbenAdmin Logo" width="100%" src="./build/docs/imgs/preview1.png">
    <img alt="VbenAdmin Logo" width="100%" src="./build/docs/imgs/preview2.png">
    <img alt="VbenAdmin Logo" width="100%" src="./build/docs/imgs/preview3.png">
</p>

### 文档

2.0 文档还没开始写。后续补上。。

## 使用到的技术

- vue3
- composition-api:
- vuex4
- vuex-module-decorators
- vue-router4
- axios@0.19.2
- ant-design-vue@2.x
- mockjs
- vue-i18n
- moment
- lodash

[更新日志](CHANGELOG.md)

- [使用到的技术](#使用到的技术)
- [环境要求](#环境要求)
  - [建议开发环境](#建议开发环境)
- [安装](#安装)
- [命令参考(Terminal)](#命令参考terminal)
  - [启动开发环境](#启动开发环境)
  - [打包](#打包)
  - [格式化](#格式化)
  - [其他](#其他)
- [Git 提交规范](#git-提交规范)
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

## 代码贡献

1. Fork 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交`pull request`

## 开发计划

由于开发时间较短，所以功能暂时较少

后续会逐步完善，有需要什么组件可以提出来

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
- [x] 全屏
- [x] 模拟数据
- [x] 剪贴板封装
- [x] hook 封装
- [x] 项目可配置
- [x] 表单组件
- [x] 右键菜单
- [x] 水印插件
- [x] 动画组件
- [x] 二维码插件
- [x] 国际化插件
- [x] 详情组件
- [x] 图片裁剪
- [x] 验证码/验证组件
- [x] 树组件
- [x] 系统性能优化
- [x] 兼容最新`vuex`,`vue-router`
- [x] 图片预览组件
- [ ] 表格组件
- [ ] 可编辑表格
- [ ] 图表库
- [ ] 数字动画
- [ ] 主题配置
- [ ] 富文本组件
- [ ] 首屏加载等待动画
- [ ] 上传组件
- [ ] 数据导入导出
- [ ] 黑暗主题

更多组件/功能/建议/bug/欢迎提交 pr 或者 issue

## 加入我们

`VUE-VBEN-ADMIN` 是完全开源免费的项目，旨在帮助开发者更方便地进行中大型管理系统开发，同时也提供 QQ 交流群(项目刚起步，人数较少，有兴趣的可以加群一起讨论)，使用问题欢迎在群内提问。

- QQ 群 `569291866`

 <img alt="VbenAdmin Logo" width="100" src="./build/docs/imgs/qq.jpeg">
