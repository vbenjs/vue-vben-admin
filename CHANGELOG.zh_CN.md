# 2.0.0-rc.2 (2020-10-17)

### ✨ Features

- 打包可以配置输出`gizp`
- 打包可以配置删除`console`
- 路由及菜单不需要在手动引入，改为自动引入

### 🎫 Chores

- 升级 vue 到`3.0.1`
- 将`vite`版本改为每日构建版本

### 🐛 Bug Fixes

- 修复菜单报错
- 修复表格自适应高度问题
- 修复`window系统`执行 script 报错问题
- 修复折叠组件问题

### ⚡ Performance Improvements

- 删除菜单最小化背景
- 阻止页面刷新重新渲染菜单
- 其他一些细节优化

# 2.0.0-rc.1 (2020-10-14)

### ✨ Features

- 添加带参 tab

### ⚡ Performance Improvements

- 菜单折叠优化
- 页面细节优化
- 打包后压缩 html
- 预览组件及右键菜单函数化重构
- 预览组件操作列居中

### 🎫 Chores

- 更新依赖
- 添加`README.en-US.md`
- 添加`CHANGELOG.en-US.md`

### 🐛 Bug Fixes

- 修复页面刷新跳转到登陆页

# 2.0.0-beta.7 (2020-10-12)

### ⚡ Performance Improvements

- 现有的选项卡切换不再显示动画和和进度条

### ✨ Features

- 新增 `CountTo`组件及示例 demo
- 项目配置文件新增 `closeMessageOnSwitch`和`removeAllHttpPending`
- 生产环境独立出配置文件，用于动态配置项目配置
- 新增 `useEcharts`和`useApexChart`来方便图表使用，同时新增相关 demo
- 新增工作台界面
- 新增分析页界面

### 🎫 Chores

- 更新依赖

### 🐛 Bug Fixes

- 修复路由切换，tab 未激活问题

# 2.0.0-beta.56 (2020-10-11)

### 💄 Styles

- 菜单样式调整

### 🐛 Bug Fixes

- 修复可编辑表格不能输入问题
- 修复打包报错，生产环境不需要设计 proxy

### ⚡ Performance Improvements

- 优化多标签页切换速度
- 首屏加载动画

# 2.0.0-beta.5 (2020-10-10)

### ♻ Code Refactoring

- 删除`tailwind css`

### ⚡ Performance Improvements

- 优化页面切换速度

### 🎫 Chores

- 添加 `.vscode`和`.github`配置
- 更改菜单图标
- 新增`.env`配置文件
- 更新 readme.md

### 🐛 Bug Fixes

- 修复`Tree`组件勾选事件失效问题

# 2.0.0-beta.4 (2020-10-08)

### 🎫 Chores

- 删除多余依赖

### 🐛 Bug Fixes

- 修复页面刷新空白
- 修复表格在生产环境样式失效

# 2.0.0-beta.3 (2020-10-07)

### ✨ Features

- 项目配置文件新增`openNProgress`用于控制是否开启顶部控制条
- 添加`table`组件及 demo

### 🎫 Chores

- 添加` github workflows`

# 2.0.0-beta.2 (2020-10-07)

### ✨ Features

- 新增图片预览组件

### 🔧 Continuous Integration

- 增加 githubAction 脚本

# 2.0.0-beta.1(2020-09-30)

### 🎫 Chores

- 从 1.0 迁移部分代码
- 添加 README.md 描述文件

### 🐛 Bug Fixes

- 修复表单，动画及打包失败问题
