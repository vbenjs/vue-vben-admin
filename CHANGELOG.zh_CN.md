## 2.0.0-rc.11 (2020-11-18)

### ✨ Features

- 新增 base64 文件流下载
- 优化上传组件及示例
- 新增可编辑行示例
- 新增个人页
- 新增表单页
- 新增详情页
- 将上传组件默认集成到 form

### 🎫 Chores

- 更新 antdv 到`2.0.0-rc.1`（暂时还原到 beta15,rc1 菜单卡顿太严重.）
- 添加部分注释

### ✨ Refactor

- 移除`useModal`与`useDrawer`的`receiveDrawerDataRef`和`transferDrawerData`属性
- `useModal`与`useDrawer`对应的`openModal`与`openDrawer`扩展第三个参数。用于再次打开触发回调

### 🐛 Bug Fixes

- 修复表单 inputNumber 校验错误
- 修复表单默认值设置错误
- 修复菜单折叠按钮隐藏时占位问题
- 修复表单 baseColProps 不生效

## 2.0.0-rc.10 (2020-11-13)

### ✨ Refactor

- 重构 hook,引入 `@vueuse`，删除其中已有的`hook`,优化现有的 hook
- `useEvent` 更名->`useEventListener`
- 表单`ComponentType`删除 `SelectOptGroup`,`SelectOption`,`Transfer`,`Radio`,四个类型。修改`RadioButtonGroup`组件

### ✨ Features

- 表单项的`componentsProps`支持函数类型
- 菜单新增 tag 显示，支持 4 中类型颜色及 dot 圆点显示
- 新增菜单及顶栏颜色选择配色
- 增加示例结果页
- 新增文件下载示例

### ⚡ Wip

- 上传组件(未完成，测试中...)

### ⚡ Performance Improvements

- 优化 settingDrawer 代码
- 优化多标签页切换速度
- 增加表单自定义及动态能力

### 🐛 Bug Fixes

- 修复多个富文本编辑器只显示一个
- 修复登录过期后重新登录未跳转原来页面的
- 修复 window 系统动态引入错误
- 修复页面类型错误
- 修复表单 switch 和 checkBox 单独使用报错

## 2.0.0-rc.9 (2020-11-9)

### ✨ Features

- 菜单 trigger 可以选择位置
- 增加富文本嵌入表单的示例
- 表单组件 schema 增加 `required`属性。简化配置
- openModal 和 openDrawer 第二个参数可以代替`transferModalData`传参到内部
- 带参路由可以被缓存

### ✨ Refactor

- 重构由后台生成菜单的逻辑
- Route Module 结构改造

### ⚡ Performance Improvements

- 菜单性能继续优化,更流畅
- 优化懒加载组件及示例
- layout 样式微调

### 🎫 Chores

- 删除菜单背景图
- 更新`ant-design-vue`版本为`beta15`
- 更新`vite`版本为`rc.9`
- 异常页调整
- `BasicTitle` 色块默认不显示

### 🐛 Bug Fixes

- 修复升级之后 table 类型问题
- 修复分割菜单且左侧菜单没有数据时候，继续展示上一次子菜单的问题
- 修复`useMessage`类型问题
- 修复表单项设置`disabled`不生效问题
- 修复`useECharts`在`resize`时不能自适应,报错
- 修复`useWatermark`在清空后`resize`未删除
- 修复表单校验问题
- 修复多级表头配置不生效问题

## 2.0.0-rc.8 (2020-11-2)

### ✨ Features

- 全局 loading 添加文本
- 右键菜单支持多级

### 🎫 Chores

- 登录缓存从 sessionStorage 改为 LocalStorage

### ⚡ Performance Improvements

- 更新`ant-design-vue`到`beta.12`
- Layout 界面布局样式调整
- 优化懒加载组件
- 优化表格渲染性能
- 表单折叠搜索添图标添加动画
- routeModule 可以忽略 layout 配置不写。方便配置一级菜单

### 🐛 Bug Fixes

- 修复表格类型错误
- 修复 mock 分页工具错误
- 修复表格开启搜索表单折叠问题
- 修复表格 size 为 samll 时候，fixed 列样式问题
- 修复多标签页关闭报错问题
- 修复 message 类型错误

## 2.0.0-rc.7 (2020-10-31)

### ✨ Features

- 表单组件现在支持直接传入 model 直接进行 set 操作，参考**组件->弹窗扩展->打开弹窗并传递数据**

- modal 的 useModalInner 现在支持传入回调函数，用于接收外部`transferModalData`传进来的值，

  - 用于处理打开弹窗对表单等组件的设置值。参考**组件->弹窗扩展->打开弹窗并传递数据**
  - `receiveModalDataRef`这个值暂时保留。尽量少用。后续可能会删除。

- drawer 的 useDrawerInner 现在支持传入回调函数，用于接收外部`transferModalData`传进来的值，
  - 用于处理打开抽屉对表单等组件的设置值。参考**组件->抽屉扩展->打开抽屉并传递数据**
  - `receiveModalDataRef`这个值暂时保留。尽量少用。后续可能会删除。

### ✨ Refactor

- 表单代码优化重构

### ⚡ Performance Improvements

- Modal slot 可以覆盖
- 优化表格嵌入高度计算问题

### 🎫 Chores

- 添加部分注释
- pwa 图标补充
- types 类型调整
- 升级`ant-design-vue`到`beta.11`,并修改带来的已知问题,部分问题发现后在解决

### 🐛 Bug Fixes

- 修复本地代理 post 接口到 https 地址超时错误
- 修复 modal 在不显示 footer 的时候全屏高度计算问题
- 修复表单重置未删除校验信息错误
- 修复顶部菜单分割模式样式问题
- 修复表格展开图标动画失效

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
