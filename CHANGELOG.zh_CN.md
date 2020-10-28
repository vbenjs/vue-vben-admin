## Wip

### 🐛 Bug Fixes

- 修复本地代理 post 接口到 https 地址超时错误

## 2.0.0-rc.6 (2020-10-28)

### ✨ Features

- 新增`pwa`功能，可在`.env.production`开启
- Button 组件扩展 `preIcon`和`postIcon`属性用于在文本前后添加图标
- 恢复面包屑显示图标功能

### 🎫 Chores

- 升级 vite 版本为`v1.0.0.rc8`
- vite.config.ts 内部 plugins 抽取
- build 目录结构调整
- 依赖更新
- 文档更新
- 修改默认路由切换动画

### ⚡ Performance Improvements

- `setTitle`逻辑调整
- 将系统用到的 sessionStorage 及 LocalStorage 缓存设置默认 `7` 天过期

### ✨ Refactor

- 独立出`vite-plugin-html`,并修改相关插入 html 的逻辑

### 🐛 Bug Fixes

- 修复热更新时多次注册组件警告问题
- 修复登录后出现登录标签页
- 修复路由切换参数消失问题
- 修复 useMessage 图标样式问题

## 2.0.0-rc.5 (2020-10-26)

### ✨ Features

- 更新组件文档
- 面包屑支持显示图标
- 新增 tinymce 富文本组件
- 表单新增 submitOnReset 控制是否在重置时重新发起请求
- 表格新增`sortFn`支持自定义排序
- 新增动画组件及示例
- 新增懒加载/延时加载组件及示例

### ✨ Refactor

- Drawer 组件的 detailType 修改为 isDetail

### 🎫 Chores

- 删除代码内的可选链语法
- 表单重置逻辑修改
- 关闭多标签页 tabs 动画
- 升级 vite 版本为`v1.0.0.rc6`
- 删除中文路径警告。rc6 已修复

### 🐛 Bug Fixes

- 修复抽屉组件自动高度及显示 footer 显示问题
- 修复表单查询后重置回默认值
- 修复菜单没有子节点时显示折叠的问题
- 修复面包屑显示样式问题
- 修复 modal 在 destroyOnClose=true 时多次打开拖拽失效
- 修复表格出现多个 action 列

# 2.0.0-rc.4 (2020-10-21)

### ✨ Features

- 表格新增配置工具栏
- 新增消息通知模块

### 🎫 Chores

- 表格默认不显示边框
- 依赖更新
- 更新 vue 为`v3.0.2`
- 界面样式微调

### ⚡ Performance Improvements

- 优化首屏体积大小
- 优化 TableAction 组件
- 减小菜单折叠宽度

### 🐛 Bug Fixes

- 修复一级菜单折叠显示菜单名问题
- 修复预览命令不打包问题
- 修复表格 actionColOptions 参数不生效问题
- 修复表格刷新表单 loading 不生效问题
- 修复带参界面刷新参数丢失问题

# 2.0.0-rc.3 (2020-10-19)

### ✨ Features

- 新增 excel 组件及 excel/xml/csv/html 导出示例
- 新增 excel 导入示例
- 新增全局错误处理
- 新增 markdown 组件及示例
- 新增折叠菜单时可显示菜单名

### Docs

- 添加项目文档

### 🎫 Chores

- 升级依赖
- 其他细节优化

### 🐛 Bug Fixes

- 修复顶部菜单自适应问题
- 修复 window 系统打包报错问题

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
