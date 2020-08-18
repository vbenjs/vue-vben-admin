# [1.3.0](https://github.com/anncwb/vue-vben-admin/compare/1.2.0...1.3.0) (2020-08-18)

### ⚡ Performance Improvements

- **ci:** 优化打包分包逻辑 ([deac39d](https://github.com/anncwb/vue-vben-admin/commit/deac39d))
- 删除不必要的依赖,优化表单组件性能 ([1ee22e9](https://github.com/anncwb/vue-vben-admin/commit/1ee22e9))
- 优化表单表格性能 ([b2d7d08](https://github.com/anncwb/vue-vben-admin/commit/b2d7d08))
- 优化详情，drawer 组件 ([78b338e](https://github.com/anncwb/vue-vben-admin/commit/78b338e))
- 整体性能调优 ([defba37](https://github.com/anncwb/vue-vben-admin/commit/defba37))
- 路由切换性能优化 ([9904798](https://github.com/anncwb/vue-vben-admin/commit/9904798))

### ✨ Features

- **form:** 表单增加 slot ([3e30146](https://github.com/anncwb/vue-vben-admin/commit/3e30146))
- **strength-meter:** 新增密码强度检测组件 ([86cfcd8](https://github.com/anncwb/vue-vben-admin/commit/86cfcd8))

### 🎫 Chores

- build 1.2.0 ([2761d65](https://github.com/anncwb/vue-vben-admin/commit/2761d65))
- 更新最新依赖 ([2f6c193](https://github.com/anncwb/vue-vben-admin/commit/2f6c193))

### 🐛 Bug Fixes

- **content:** 删除主体公用 scroll,使用浏览器自带 scrollbar ([a1db7d6](https://github.com/anncwb/vue-vben-admin/commit/a1db7d6))
- **verify:** 修复验证码组件 bug ([05f9eac](https://github.com/anncwb/vue-vben-admin/commit/05f9eac))
- **vuex:** 全局配置 vuex-module-decorators 的 rawError 默认值为 true ([3a5242b](https://github.com/anncwb/vue-vben-admin/commit/3a5242b))

# [1.2.0](https://github.com/anncwb/vue-vben-admin/compare/1.1.0...1.2.0) (2020-08-11)

### ⚡ Performance Improvements

- **button:** 对按钮进行优化扩展 ([2d5112c](https://github.com/anncwb/vue-vben-admin/commit/2d5112c))
- **code:** 优化代码 ([2791d38](https://github.com/anncwb/vue-vben-admin/commit/2791d38))
- **setting:** 新增 openLoginVerify 属性,优化部分路由菜单结构 ([a473da8](https://github.com/anncwb/vue-vben-admin/commit/a473da8))
- **table:** 加强 table 功能 ([0a2b1a1](https://github.com/anncwb/vue-vben-admin/commit/0a2b1a1))
- **tree:** tree 组件加强,增加节点操作函数 ([4035d4f](https://github.com/anncwb/vue-vben-admin/commit/4035d4f))

### ✨ Features

- **modal:** 增加 footerOffset 参数 ([a40301c](https://github.com/anncwb/vue-vben-admin/commit/a40301c))
- **qrcode:** 新增二维码 logo 功能 ([f1f2da1](https://github.com/anncwb/vue-vben-admin/commit/f1f2da1))
- **table:** 扩展表格合计列功能,并增加 demo ([15c60a0](https://github.com/anncwb/vue-vben-admin/commit/15c60a0))
- **table:** 新增可编辑表格示例 ([aef79eb](https://github.com/anncwb/vue-vben-admin/commit/aef79eb))

### 🎫 Chores

- **deps:** 更新 vue-cli 4.4.6 为 4.5.2 ([d68fa7d](https://github.com/anncwb/vue-vben-admin/commit/d68fa7d))
- build 1.1.0 ([fbe1564](https://github.com/anncwb/vue-vben-admin/commit/fbe1564))

### 🐛 Bug Fixes

- **drawer:** 修复 drawer 在路由切换后不会自动关闭问题 ([9ba5169](https://github.com/anncwb/vue-vben-admin/commit/9ba5169))
- **drawer:** 修复 drawer 详情模式错误 ([59c343f](https://github.com/anncwb/vue-vben-admin/commit/59c343f))
- **drawer:** 修复 settingDrawer 失效 ([cf2661f](https://github.com/anncwb/vue-vben-admin/commit/cf2661f))
- **mock:** 修复打包后 mock 加载错误问题 ([39cf49e](https://github.com/anncwb/vue-vben-admin/commit/39cf49e))
- **table:** 修复表格左侧固定列在显示 index 列的时候显示错误 ([37176f7](https://github.com/anncwb/vue-vben-admin/commit/37176f7))
- **table:** 修复表格错位问题 ([6970de1](https://github.com/anncwb/vue-vben-admin/commit/6970de1))
- **tinymce:** example 例子修改 ([9d39ec9](https://github.com/anncwb/vue-vben-admin/commit/9d39ec9))
- **tinymce:** 修复集成 form 时，无法设置问题 ([5577981](https://github.com/anncwb/vue-vben-admin/commit/5577981))
- **upload:** 点击保存后才开始上传；修复集成 form 问题 ([9606607](https://github.com/anncwb/vue-vben-admin/commit/9606607))

# [1.1.0](https://github.com/anncwb/vue-vben-admin/compare/1.0.4...1.1.0) (2020-08-05)

### ♻ Code Refactoring

- **button:** 将 button 注册为全局组件,方便改造 ([d455440](https://github.com/anncwb/vue-vben-admin/commit/d455440))
- **use-router:** 重构 useRouter 的 vue 实例初始化 ([6d3afd2](https://github.com/anncwb/vue-vben-admin/commit/6d3afd2))

### ⚡ Performance Improvements

- **verify:** 优化验证码组件提示 ([f0b3417](https://github.com/anncwb/vue-vben-admin/commit/f0b3417))
- 优化 hooks ([6ee5548](https://github.com/anncwb/vue-vben-admin/commit/6ee5548))
- **hooks:** perf hooks ([3ec145d](https://github.com/anncwb/vue-vben-admin/commit/3ec145d))

### ✨ Features

- **excel-plugins:** add import and export excel plugin ([5bbfc7f](https://github.com/anncwb/vue-vben-admin/commit/5bbfc7f))
- **tree:** new tree component ([bb773b7](https://github.com/anncwb/vue-vben-admin/commit/bb773b7))

### 🎫 Chores

- build 1.0.4 ([1d56fc0](https://github.com/anncwb/vue-vben-admin/commit/1d56fc0))

### 🐛 Bug Fixes

- **table:** 修复未使用 useTable 时候组件报错问题 ([9e7fde4](https://github.com/anncwb/vue-vben-admin/commit/9e7fde4))
- **table:** 修复未使用 useTable 时候组件报错问题 ([5b2399c](https://github.com/anncwb/vue-vben-admin/commit/5b2399c))
- **verify:** 修复第一次加载未设置旋转角度问题 ([9210541](https://github.com/anncwb/vue-vben-admin/commit/9210541))

### 💄 Styles

- **css-prefix:** unified style prefix ([4403ca0](https://github.com/anncwb/vue-vben-admin/commit/4403ca0))

### 🔧 Continuous Integration

- **mock:** fix dev mock error ([34d2dfa](https://github.com/anncwb/vue-vben-admin/commit/34d2dfa))
- **mock:** remove console ([c0d1739](https://github.com/anncwb/vue-vben-admin/commit/c0d1739))
- **npm-hook:** automatically created when the .cache folder does not exist ([88f285b](https://github.com/anncwb/vue-vben-admin/commit/88f285b))

## [1.0.4](https://github.com/anncwb/vue-vben-admin/compare/1.0.3...1.0.4) (2020-07-31)

### ⚡ Performance Improvements

- 整体优化，加快页面切换速度 ([5ffaaaa](https://github.com/anncwb/vue-vben-admin/commit/5ffaaaa))

### ✨ Features

- **verify:** add verify component ([8e8a00a](https://github.com/anncwb/vue-vben-admin/commit/8e8a00a))

### 🎫 Chores

- **deps:** update dep ([6753cb1](https://github.com/anncwb/vue-vben-admin/commit/6753cb1))
- update deps ([33adcb1](https://github.com/anncwb/vue-vben-admin/commit/33adcb1))
- update readme.md ([ca30c66](https://github.com/anncwb/vue-vben-admin/commit/ca30c66))

### 🐛 Bug Fixes

- **ci:** fix the problem that git does not exist during dev and build ([ab3ef33](https://github.com/anncwb/vue-vben-admin/commit/ab3ef33))
- **components:** add download example ([f9abfc7](https://github.com/anncwb/vue-vben-admin/commit/f9abfc7))
- **components:** tinymce add showUploadImage props ([c05cab1](https://github.com/anncwb/vue-vben-admin/commit/c05cab1))
- **components:** upload add action props and preview function ([ee61193](https://github.com/anncwb/vue-vben-admin/commit/ee61193))
- **tinymce:** change tab input debug ([2e3f5d4](https://github.com/anncwb/vue-vben-admin/commit/2e3f5d4))
- **upload:** update preview ([4a90588](https://github.com/anncwb/vue-vben-admin/commit/4a90588))
- **upload:** update style ([54b1add](https://github.com/anncwb/vue-vben-admin/commit/54b1add))

### 🔧 Continuous Integration

- add ls-lint ([1c17bfb](https://github.com/anncwb/vue-vben-admin/commit/1c17bfb))
- perf changelog ([3cb6eda](https://github.com/anncwb/vue-vben-admin/commit/3cb6eda))
- update npm-hook ([4c1fc0b](https://github.com/anncwb/vue-vben-admin/commit/4c1fc0b))

## [1.0.3](https://github.com/anncwb/vue-vben-admin/compare/24cea92...1.0.3) (2020-07-28)

### ⚡ Performance Improvements

- **error-handle:** optimize the display of error log details ([067c97d](https://github.com/anncwb/vue-vben-admin/commit/067c97d))
- compatible vue ([24cea92](https://github.com/anncwb/vue-vben-admin/commit/24cea92))

### ✨ Features

- **breadcrumb:** add breadcrumb ([c8ecd1b](https://github.com/anncwb/vue-vben-admin/commit/c8ecd1b))
- **component:** add form component ([31e3522](https://github.com/anncwb/vue-vben-admin/commit/31e3522))
- **component:** add tinymce component ([64c02b3](https://github.com/anncwb/vue-vben-admin/commit/64c02b3))
- **component:** add upload image component ([e9a2ebf](https://github.com/anncwb/vue-vben-admin/commit/e9a2ebf))
- **component:** added parallax and count-to components ([e130c98](https://github.com/anncwb/vue-vben-admin/commit/e130c98))
- **components:** add virtual-scroll and preview component ([e9e2371](https://github.com/anncwb/vue-vben-admin/commit/e9e2371))
- **doc:** add doc path ([cefdb96](https://github.com/anncwb/vue-vben-admin/commit/cefdb96))
- **drag-panel:** 新增拖拽面板及表格行列拖拽 ([13aeb70](https://github.com/anncwb/vue-vben-admin/commit/13aeb70))
- **error-handle:** add error-handle plugin and error-log page, Update document address ([6df8e6c](https://github.com/anncwb/vue-vben-admin/commit/6df8e6c))
- **example:** add guide page ([e13d12b](https://github.com/anncwb/vue-vben-admin/commit/e13d12b))
- **example:** add icons example ([b329a9a](https://github.com/anncwb/vue-vben-admin/commit/b329a9a))
- **i18n:** added i18n plugin ([e4ac8dd](https://github.com/anncwb/vue-vben-admin/commit/e4ac8dd))
- **img-crop:** added img-crop demo ([47e426c](https://github.com/anncwb/vue-vben-admin/commit/47e426c))
- **modal:** added new extension modal component ([b45cd74](https://github.com/anncwb/vue-vben-admin/commit/b45cd74))
- **npm-hook:** add preserve.js ([4fc9ea7](https://github.com/anncwb/vue-vben-admin/commit/4fc9ea7))
- **plugins:** add context-menu plugin ([69ac331](https://github.com/anncwb/vue-vben-admin/commit/69ac331))
- **plugins:** add qrcode plugin ([3453b1a](https://github.com/anncwb/vue-vben-admin/commit/3453b1a))
- **print-plugin:** add print plugin ([5d375e2](https://github.com/anncwb/vue-vben-admin/commit/5d375e2))
- **table:** add table component and demo ([070e6e3](https://github.com/anncwb/vue-vben-admin/commit/070e6e3))
- **预览站点:** 使用 cdn 时增加百度统计 ([e17fa98](https://github.com/anncwb/vue-vben-admin/commit/e17fa98))
- add cache operation example ([236f891](https://github.com/anncwb/vue-vben-admin/commit/236f891))
- add charts ([180f4c1](https://github.com/anncwb/vue-vben-admin/commit/180f4c1))
- add functions page ([df351eb](https://github.com/anncwb/vue-vben-admin/commit/df351eb))
- add permission switch demo ([d9ec6f2](https://github.com/anncwb/vue-vben-admin/commit/d9ec6f2))
- added rolling components and lazy loading component ([69b061f](https://github.com/anncwb/vue-vben-admin/commit/69b061f))
- **工作台:** 新增工作台页面 ([303bca3](https://github.com/anncwb/vue-vben-admin/commit/303bca3))
- complete multi-mode rights management ([fbfb3b1](https://github.com/anncwb/vue-vben-admin/commit/fbfb3b1))

### 🎫 Chores

- update deps ([78c91c7](https://github.com/anncwb/vue-vben-admin/commit/78c91c7))
- **readme.md:** update readme.md ([97e1ec1](https://github.com/anncwb/vue-vben-admin/commit/97e1ec1))
- add license ([39a933d](https://github.com/anncwb/vue-vben-admin/commit/39a933d))
- rename useRouter ([af79062](https://github.com/anncwb/vue-vben-admin/commit/af79062))
- update readme.md ([b8c428c](https://github.com/anncwb/vue-vben-admin/commit/b8c428c))
- update readme.md ([d222258](https://github.com/anncwb/vue-vben-admin/commit/d222258))
- update readme.md ([1b55260](https://github.com/anncwb/vue-vben-admin/commit/1b55260))

### 🐛 Bug Fixes

- **components:** add file upload,modal add closeFunc props ([92f19a9](https://github.com/anncwb/vue-vben-admin/commit/92f19a9))
- **components:** fix upload close/breadcrumb dark theme/tabchange bug ([bf1d756](https://github.com/anncwb/vue-vben-admin/commit/bf1d756))
- **use-columns:** 修复 useColumns 表格列显示问题 ([4b86d54](https://github.com/anncwb/vue-vben-admin/commit/4b86d54))
- **use-go:** fix useGo router is undefined ([99a9b2d](https://github.com/anncwb/vue-vben-admin/commit/99a9b2d))
- **vac:** fix vca plugins auto import onMounted onunMounted ([5fea1d0](https://github.com/anncwb/vue-vben-admin/commit/5fea1d0))
- **workbench:** update image's name and performance api ([838681d](https://github.com/anncwb/vue-vben-admin/commit/838681d))
- remove scroll component props ([bc1398a](https://github.com/anncwb/vue-vben-admin/commit/bc1398a))
- update deps ([5c65182](https://github.com/anncwb/vue-vben-admin/commit/5c65182))
- vuex error ([67f827f](https://github.com/anncwb/vue-vben-admin/commit/67f827f))
