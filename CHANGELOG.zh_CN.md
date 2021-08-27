### ✨ Features

- **BasicForm** 表单组件新增`Divider`，用于较长表单的区域分割
- **BasicTable**
  - 单元格编辑新增提交回调，将根据回调函数返回的结果来决定是否将数据提交到表格
  - 行编辑添加校验方法，允许只校验而不提交值，以便异步保存数据成功后才提交倒表格

### 🐛 Bug Fixes

- **CodeEditor** 修复 JSON 编辑器在格式化无效 JSON 文本时会抛出异常的问题
- **Tinymce** 修复 inline 模式在一些场景下会出现异常的问题
- **BasicTable**
  - 修复可编辑单元格的内容为空时，不会显示编辑图标的问题
  - 修复表尾合计行与表格主体部分的列有时候未能对齐的问题
- **其它**
  - 修复部分封装组件在使用插槽时报错的问题
  - 修复`useECharts`的`theme`参数不起作用的问题
  - 修复`Token`失效时，按 F5 刷新页面可能会出现页面加载异常的问题
  - 修复`useRedo`的不当调用可能会导致重定向`path`异常的问题
  - 修复`vite`自定义模式名称不支持下划线的问题

## 2.7.1(2021-08-16)

- 升级 vue 3.2,如果运行失败，删除 node_modules 后重装即可

### ✨ Features

- **BasicTree** 添加搜索功能相关属性和方法
- **BasicForm** 新增`alwaysShowLines`用于设置折叠时保留显示的行数

### 🐛 Bug Fixes

- **Cropper** 修复未能及时销毁的问题
- **BasicTable**
  - 修复`CellFormat`无法使用`Map`类型数据的问题
  - 修复可编辑单元格未能正确显示`0`值的问题
  - 修复 selection-change 事件在取消勾选时未能正确触发的问题
  - 修复浅色主题下的全屏状态背景颜色不正确的问题
  - 修复`getSelectRows`不支持远程数据跨页选择时获取完整数据的问题
  - 修复在`editComponentProps`中为编辑组件提供的`size`属性无效的问题
- **Qrcode** 修复二维码组件在创建时未能及时绘制的问题
- **BasicModal** 修复`helpMessage`属性不起作用的问题
- **BasicButton** 修复按钮样式表现与 antd 官方不一致的问题
- **其它** 修复`useRedo`(重新加载当前路由)会丢失路由`params`数据的问题

## 2.7.0(2021-08-03)

## (破坏性更新) Breaking changes

- 将项目`tailwindcss`还原回`windicss`，尝试了`tailwindcss`，问题可能还挺多，先切换回`windicss`提高开发效率，切换成本较低。
  - 目前项目不兼容地方有
    - `xl:!m-4` 之类的写法需要改为`!xl:m-4`,注意只有`!`这个不兼容，没用到则不用改
    - 内存溢出问题可能还在（频率低，重启下即可，重启 vite 较快）

### ✨ Features

- **Preview** 添加新的属性及事件
- **Dark Theme** 新增对 tailwindcss 夜间模式的支持
- **其它** 为 useLoading 添加 setTip 方法

### 🐛 Bug Fixes

- **ApiTreeSelect** 修复未能正确监听`params`变化的问题
- **ImgRotateDragVerify** 修复组件`resume`方法无法调用的问题
- **TableAction** 修复 stopButtonPropagation 属性某些情况下不起作用的问题
- **PageWrapper** 修复`class`属性无效的问题
- **BasicTree** 修复`checkAll`方法会影响到`disabled`状态节点的问题
- **BasicTable**
  - 修复可编辑单元格不支持`ellipsis`配置的问题
  - 修复全屏模式下看不到子组件弹出层（popconfirm 以及 select、treeSelect 等编辑组件）的问题
  - 修复启用`expandRowByClick`时，点击不可展开的行可能会导致样式错误的问题
  - 修复`pagination`属性动态改变不生效的问题
  - 修复`getSelectRows`不支持树形表格子级数据的问题
- **Dark Theme** 黑暗主题下的配色问题修正
  - 修复`Tree`组件被选中节点的背景颜色
  - 修复`Alert`组件的颜色配置
  - 修复禁用状态下的`link`类型的按钮颜色问题
  - 修复`Tree`已勾选的复选框的样式问题
- **其它** 修复 useScript 未能自动移除 script 节点的问题

## 2.6.1(2021-07-19)

### ✨ Features

- **NoticeList** 添加分页、超长自动省略、标题点击事件、标题删除线等功能
- **MixSider** 优化 Mix 菜单布局时 底部折叠按钮 的样式，与其它菜单布局时的风格保持一致
- **ApiTreeSelect** 扩展`antdv`的`TreeSelect`组件，支持远程数据源，用法类似`ApiSelect`
- **BasicTable**
  - 新增`ApiTreeSelect`编辑组件
  - 新增`headerTop`插槽
- **其它** 可以为不同的用户指定不同的后台首页：
  - 在`getUserInfo`接口返回的用户信息中增加`homePath`字段(可选)即可为当前用户定制首页路径

### 🐛 Bug Fixes

- **BasicTable**
  - 修复滚动条样式问题(移除了滚动样式补丁)
  - 修复树形表格的带有展开图标的单元格的内容对齐问题
  - 修复操作列的按钮在 disabled 状态下的颜色显示
  - 修复可编辑单元格的值不能直接通过修改`dataSource`来更新显示的问题
  - 修复使用`ApiSelect`编辑组件时的数据回显问题
  - 修复在部分场景下编辑组件可能会报`onXXX`类型错误的问题
- **TableAction**
  - 仅在 `action.tooltip`存在的情况下 才创建 Tooltip 组件
  - 修复组件内的圆形按钮内容没有居中的问题
- **AppSearch** 修复可能会搜索隐藏菜单的问题
- **BasicUpload** 修复处理非`array`值时报错的问题
- **Form** 修复`FormItem`的`suffix`插槽样式问题
- **Menu**
  - 修复左侧混合菜单的悬停触发逻辑
  - 修复顶栏菜单在显示包含需要隐藏的菜单项目时出错的问题
  - 修复悬停触发模式下左侧混合菜单会在没有子菜单且被激活时直接跳转路由
- **Breadcrumb** 修复带有重定向的菜单点击无法跳转的问题
- **Markdown** 修复初始化异常以及不能正确地动态设置 value 的问题
- **Modal** 确保 props 正确被传递
- **MultipleTab** 修复可能会意外创建登录路由标签的问题
- **BasicTree** 修复搜索功能可能导致`checkedKeys`丢失的问题
- **CodeEditor** 修复 value 不支持 v-model 用法的问题
- **CountdownInput** 修复不支持`input`插槽的问题
- **ApiSelect** 修复`options-change`事件参数不是`select`所使用的标准`options`数据的问题
- **其它**
  - 修复菜单默认折叠的配置不起作用的问题
  - 修复`safari`浏览器报错导致网站打不开
  - 修复在 window 上，拉取代码后 eslint 因 endOfLine 而报错问题
  - 修复因动态路由而产生的 `Vue Router warn`

### 🎫 Chores

- 添加 test 环境测试命令

## 2.6.0(2021-07-04)

### ✨ Features

- **Axios** 新增`withToken`配置，用于控制请求是否携带 token
- **BasicUpload**
  - 新增在预览 `Modal` 中删除文件时触发`preview-delete` 事件
  - `value` 支持 `v-model` 用法
- **Route 配置**
  - 增加`ignoreRoute`用于在`ROUTE_MAPPING`或`BACK`权限模式下仅生成菜单
  - 增加`hidePathForChildren`配置，标识为子项目生成菜单时忽略本级`path`
- **TableAction** 新增`tooltip`配置，可以为按钮增加 tooltip 提示
- **CropperAvatar**
  - 新增`value`用于设置当前头像
  - 新增`onChange`用于接受头像剪裁并上传成功事件
  - 新增`btnText`、`btnProps` 用于自定义上传按钮文案和属性
  - 为剪裁`Modal`内的操作按钮添加工具提示
- **Modal** 为右上角的操作按钮添加工具提示

### 🐛 Bug Fixes

- **Modal**
  - 修复点击遮罩不能关闭的问题
  - 修复 `setModalProps` 不支持设置 `defaultFullscreen` 的问题
- **Table**
  - 修复 `editComponentProps` 不支持 `onChange`的问题
  - 修复启用`clickToRowSelect`时，点击行不会触发`selection-change`事件的问题
  - 修复全局配置`fetchSetting`可能会被局部配置意外修改的问题
  - 修复`handleSearchInfoFn`的参数包含多余空白键的问题
  - 修复为 table 提供 rowSelection.onChange 时，无法手动变更 table 的选中项的问题
  - 修复滚动条在无需显示的时候仍然持续显示的问题
- **Icon** 修复 SvgIcon 缺少部分样式的问题
- **Menu**
  - 修复路由映射模式下，单级菜单刷新不会激活
  - 修复侧边菜单底部的折叠自定义失效的问题
- **Form** 修复`submitButtonOptions`和`resetButtonOptions`的类型定义
- **PopConfirmButton** 移除`Button`上多余的`title`
- **Axios** 修复非`GET`请求时，无法同时提交`params`和`data`数据的问题
- **其它**
  - 修复锁屏功能可以通过刷新页面或复制 URL 打开新的浏览器标签来跳过锁定状态的问题
  - 修复多个窗口同时打开页面时，`Token` 不会同步的问题
  - 修复`ROLE`权限模式下`hasPermission`不工作的问题
- **Table** 修复`handleSearchInfoFn`的参数包含多余空白键的问题
- **Tailwindcss** 移除控制台警告

## 2.5.2(2021-06-27)

### ⚡ Performance Improvements

- **Icon** 移除 Icon 组件全局注册，防止特定情况下热更新问题

### ✨ Features

- **Menu** 新增 `permissionMode=PermissionModeEnum.ROUTE_MAPPING`模式
  - 项目默认改为该模式，删除原有菜单文件
  - 如果之前已经写好了菜单，可以更改为`PermissionModeEnum.ROLE`模式即可

### 🐛 Bug Fixes

- **Drawer** 修复`visible`状态异常

## 2.5.1(2021-06-26)

### ⚡ Performance Improvements

- 升级`vue`与`ant-design-vue`版本，解决兼容问题
- **Tree** 性能优化

### 🐛 Bug Fixes

- **Table** 修复分页抖动问题
- **Upload** 确保携带自定义参数
- **Dropdown** 修复 popConfirm 的图标显示问题
- **Table** 修复树形表格的编辑事件不正常的问题
- **Table** 修复当表格数据为空时，getDataSource 返回的值不是表格所使用的数据源的问题

## 2.5.0(2021-06-20)

## (破坏性更新) Breaking changes

- 将项目`windicss`改为`tailwindcss`，解决内存溢出问题
  - 目前项目不兼容地方有
    - `!xl:m-4` 之类的写法需要改为`xl:!m-4`,注意只有`!`这个不兼容，没用到则不用改
    - `windicss`自身新增的特性需要调整，比如`Attribute`模式不兼容

### ✨ Refactor

- 移除`useExpose`,使用组件自身提供的`expose`代替

### ⚡ Performance Improvements

- **Locale** 合并多语言文件，减少文件数量
- **Utils** Mitt 默认导出由 `Class` 改为 `Function`
- **Axios** `isTransformRequestResult`更名为`isTransformResponse`

### ✨ Features

- **CropperImage** `Cropper` 头像裁剪新增圆形裁剪功能
- **CropperAvatar** 新增头像上传组件
- **Drawer** `useDrawer`新增`closeDrawer`函数
- **Preview** 新增`createImgPreview`图片预览函数
- **Setup** 新增引导页示例
- **Tests** 添加 jest 测试套件，暂不支持 Vue 组件单测
- **Axios** 新增`authenticationScheme`配置，用于指定认证方案
- **Setting** 新增 `sessionTimeoutProcessing` 项目配置项，用于配置会话超时如何处理

### 🐛 Bug Fixes

- **Modal** 修复全屏高度计算错误
- **Modal** 修复关闭事件触发多次问题
- **PageWrapper** 修复高度计算问题
- **FlowChart** 修复拖放菜单丢失
- 修复后台模式下，Iframe 路由错误
- **PageWrapper** 修复 footer 与全局页脚同时开启时的高度计算问题
- **Menu** 修复菜单折叠动画抖动问题
- **Store**修复 pinia 版本升级之后类型错误

## 2.4.2(2021-06-10)

### ✨ Refactor

- `CountTo`组件重构

### ✨ Features

- `radioButtonGroup` 支持`boolean`值
- `useModalInner` 新增 `redoModalHeight`用于在 Modal 内部重设`Modal`高度
- `useECharts` 新增`getInstance`用于获取`echart`实例
- `TableAction` 新增 `stopButtonPropagation` 阻止操作按钮点击事件冒泡
- `BasicTable` 在行编辑模式下，可以获取或设置其它处于列的编辑组件的值
- `ApiSelect` 组件在`params`改变后会自动重新`fetch`数据
- `TableImg` 组件改进
- `BasicTable` 新增 `columns-change` 事件用于监听用户改变列排序、展示、固定状态
- `Tinymce`支持动态修改 readonly
- `BasicTable`新增`updateTableDataRecord`方法用于更新指定行数据
- `useModal`新增`closeModal`方法用于关闭`Modal`

### 🐛 Bug Fixes

- 修复`redoModalHeight`不能减小高度的问题
- 修复 `BasicForm`设置 schemas 数据不生效的问题
- 修复多标签可能导致`KeepAlive`失效的问题
- 修复默认的`axios`拦截器不能处理自定义 code 的问题
- 修复锁屏弹窗的高度问题
- 修复`BaiscTable`的`列展示`复选框的半选状态显示不正确的问题
- 修复`BasicUpload`组件的预览列表某些情况下不能显示的问题
- 修复`RadioButtonGroup`的`options`设置`disabled`不生效的问题
- 修复`Tinymce`组件在只读模式下上传图片的按钮仍然可用的问题
- 修复`BasicForm`特定情况下的卡顿问题
- 修复"目录"路由不起作用的问题

## 2.4.1(2021-06-01)

### ✨ Features

- 可编辑表格新增`DatePicker`和`TimePicker`组件
- `Tree` 组件新增`defaultExpandLevel`配置

### ⚡ Performance Improvements

- 菜单搜索默认聚焦

### 🐛 Bug Fixes

- 修复`CodeEditor`已知问题
- 修复`i18n`控制台警告问题
- 修复可编辑表格`align`配置不生效问题
- 确保`axios`只对`Object`参数进行处理
- 修复`Tree`组件 `defaultExpandAll` 配置失效
- 修复`TableAction` 分割线丢失问题
- 修复表格已知问题
- 修复首次加载或改变语言导致重载时，不会设置 HTML 的 lang 属性

## 2.4.0 (2021-05-25)

### ✨ Features

- 新增图形编辑器示例
- 新增代码编辑器(包含 Json 编辑器)
- 新增 `JsonPreview`Json 数据查看组件
- 表格的数据列(column)和操作列(actionColumn)的字段可以根据权限和业务来控制是否显示
- 新增权限控制表格示例(AuthColumn.vue)
- 新增用户登录过期示例

### ⚡ Performance Improvements

- 合并部分语言文件，减少文件数量

### 🐛 Bug Fixes

- 修复黑暗主题刷新闪烁的白屏
- 修复标签页关闭其他功能失效问题
- 修复表单已知问题
- 修复自动锁屏失效

## 2.3.0 (2021-04-10)

## (破坏性更新) Breaking changes

- 使用 `pinia` 替换 `vuex`,`vuex-module-decorators`。

  - 影响，之前如果有自己使用 vuex-module-decorators，需要改造为 pinia。
  - 原因：
    - pinia 于 vuex5api 基本类似，且简单易懂。
    - 后续切换 vuex5 成本非常低，也可以当作第三方状态管理库使用

- 移除 `useKeyPress` 使用`vueuse`-`onKeyStroke`代替
- 移除 `useDebounceFn` 使用`vueuse`-`useDebounceFn`代替
- 移除 `useThrottle` 使用`vueuse`-`useThrottleFn`代替

### ✨ Features

- 标签页支持持久化保存

### ✨ Refactor

- 移除 `useElResize`

### 🐛 Bug Fixes

- 登录页样式修复
- 修复菜单已知问题
- 修复主题样式切换问题

## 2.2.0 (2021-04-06)

### ✨ Features

- 新增`headerTitle` slot
- 新增打印示例
- 新增关于界面

### ✨ Refactor

- 移除 useFullScreen 函数
- tinymce 由 Cdn 改为 npm(打包体积偏大)
- Dashboard 重构
- 移除 ApexCharts 及示例

### 🐛 Bug Fixes

- 确保面包屑正确的显示图标
- 修复 tinymce 上传按钮全屏模式下消失问题
- 确保 title 在重新登录后正常改变
- 确保后台模式登录正常
- 修复 TableAction 点击事件问题

## 2.1.1 (2021-03-26)

### ✨ Features

- 路由新增 hideChildrenInMenu 配置。用于隐藏子菜单
- 树形表格内置展开/折叠全部函数

### ✨ Refactor

- 重构路由多层模式,解决嵌套 keepalive 执行多次问题

### 🐛 Bug Fixes

- 确保 CountDownInput 组件重置清空值
- 修复分割模式下在小屏幕中显示问题
- 修复表格高度计算问题
- 修复后台路由获取不到组件问题
- 修复 Modal 组件 loadingTip 配置不生效
- 修复后台权限指令不生效
- 确保 progress 进度条正确关闭
- 修复表格勾选列配置失效问题
- 确保一级菜单可以被隐藏
- 确保表单隐藏字段校验正常

### 🎫 Chores

- 移除 ls-lint

## 2.1.0 (2021-03-15)

### ✨ Features

- 图标选择器新增 svg 模式
- 新增时间组件
- 新增高德/百度/谷歌地图示例

### ✨ Refactor

- 重构项目以解决循环依赖项导致的热更新问题
- 移除 vueHelper/useClickoutside,使用@vueuse/core 代替

### 🐛 Bug Fixes

- 确保 `table action` 的值被正确更新
- 修复页面切换的动画无法关闭
- 修复`PageWrapper`title 不显示
- 修复表格已知问题
- 修复 BasicTree 组件不能自定义 title 问题
- 修复主题切换后按钮样式问题

## 2.0.3 (2021-03-07)

### ✨ Features

- `BasicTree` 新增`clickRowToExpand`,用于单击树节点展开
- 新增 SvgIcon 插件及示例
- 账号管理界面增加左侧部门树·

### ⚡ Performance Improvements

- 表格关闭分页时不再携带分页参数
- 登录页监听回车事件进行登录
- 当表格设置自适应大小时,根据屏幕来铺满了高度.
- Tree 滚动条优化
- 优化本地开发加载速度

### 🐛 Bug Fixes

- 修复`Description`已知问题
- 修复`BasicForm`已知问题
- 修复`BasicTree`下 ActionItem 的 show 属性逻辑问题
- 修复树组件 demo 示例样式错误
- 修复账号管理新增未清空旧数据
- form 组件应允许 setFieldsValue 方法值为 null 或者 undefined
- 确保单级面包屑正确跳转
- 确保 Form 组件不校验隐藏的表单项

## 2.0.2 (2021-03-04)

### ✨ Refactor

- 重构多语言模块,支持懒加载及远程加载

### ✨ Features

- axios 支持 form-data 格式请求
- 新增图标选择器组件(支持本地和在线方式)
- 新增 WebSocket 示例和服务脚本
- Tree 组件新增 `renderIcon` 属性用于控制层级图标显示
- Tree->actionItem 新增 show 属性，用于动态控制按钮显示
- Tree 新增工具栏/title/搜索功能
- 新增部门管理/修改密码/账号管理/角色管理/菜单管理示例界面

### ⚡ Performance Improvements

- 登录界面动画优化
- 修复 github 仓库体积过大问题.
- 默认隐藏表格全屏按钮
- `crypto-es`改为`crypto-js`，减小打包体积
- `types`目录移动到根目录,兼容其他目录全局类型

### 🐛 Bug Fixes

- 修复验证码组件警告问题
- 修复表格不能正确的获取选中行
- 修复全屏状态下 modal 高度计算错误
- 修复部分表格样式问题
- 修复树形表格 `indentSize`设置失效

## 2.0.1 (2021-02-21)

### ✨ Refactor

- 登录页重构,新增注册页面/重置密码页面/手机登录/二维码登录

### ✨ Features

- 新增 `settingButtonPosition`配置项,用于配置`设置`按钮位置
- `modal`可以通过双击头部切换全屏
- 新增`CountDownInput`组件

### ⚡ Performance Improvements

- 优化可编辑居中样式及下拉框宽度过短
- 表格新增编辑时`edit-change`事件监听

### 🐛 Bug Fixes

- 修复图片预览样式错误
- 修复图标样式问题
- 修复可编辑表格下拉回显问题

## 2.0.0 (2021-02-18)

## (破坏性更新) Breaking changes

- `echarts` 升级到 5.0,并且进行按需引入(只需使用 `useECharts` 即可).

### ✨ Refactor

- 移除`global.less`,`mixin.less`,`design/helper`,由`windicss`代替,有用到的需要修改对应的样式

### ✨ Features

- useModal 新增返回值函数 `redoModalHeight`,用于在 modal 内为动态内容时刷新 modal 高度
- 升级 husky 到 5.0
- 新增 `brotli`|`gzip`压缩及相关测试命令
- 重新引入 `windicss` (与`tailwind`一样).在速度上更快

### ⚡ Performance Improvements

- 调整获取用户信息接口返回值为数组格式
- 将 error-log 列表固定为系统路由

### 🐛 Bug Fixes

- 修复 Upload 组件 maxNumber 失效问题
- 修复打包 sourcemap 报错
- 修复代码 debugger 位置显示错误
- 修复 mock 插件 post 请求错误问题
- 修复部分主题颜色值错误
- 修复表格在可编辑行状态回车确认

### 🎫 Chores

- 文档更新
- 升级 ant-design-vue 到 `2.0.0`
- 升级 vite 到 `2.0.0`

## 2.0.0-rc.18 (2021-02-05)

### ✨ Features

- `ApiSelect`新增 `numberToString`属性,用于将 value 为`number`的值全部转化为`string`
- 新增主题色切换
- 打包图片压缩

### ⚡ Performance Improvements

当不使用 mock 时,将 `mock.js` 移出打包文件

### 🐛 Bug Fixes

- 修复 modal 高度计算错误
- 修复菜单折叠状态下点击标签页弹出菜单
- 修复 form 表单初始化值为 0 问题
- 修复表格换行问题
- 修复菜单外链不跳转
- 修复菜单顶部显示问题
- 修复`modifyVars`配置失效问题

## 2.0.0-rc.17 (2021-01-18)

### ✨ Refactor

- 新增 `SimpleMenu`组件替代左侧菜单组件(顶部菜单没有替换,功能尽量做到简单不卡)。解决菜单卡顿问题。
- `ant-design-vue`组件不再全局注册。以便于更好配合 css 按需引入。如果需要全局注册,需要自己加

### ✨ Features

- `css` 按需引入

### 🐛 Bug Fixes

- 修复 `TableAction`图标问题
- 修复菜单折叠按钮丢失问题
- 修复菜单相关问题
- 修复 moment 多语言问题

## 2.0.0-rc.16 (2021-01-12)

### ✨ Refactor

- 独立组件配置到 `/@/settings/componentsSetting`
- `colorSetting`和`designSetting`现在合并为`designSetting`
- `ant-design-vue`组件注册移动到`components/registerComponent`
- 移除 `setup` 文件夹
- 升级到`vite2`
- 图片预览改为`Image`组件实现,暂时移除函数式使用方式

### ✨ Features

- 新增`mixSideTrigger`配置。用于配置左侧混合模式菜单打开方式。可选`hover`,默认`click`
- 新增`mixSideFixed`配置。用于固定左侧混合模式菜单
- modal 组件新增`height`和`min-height`属性
- 新增`PageWrapper`组件。并应用于示例页面
- 新增标签页折叠功能
- 兼容旧版浏览器
- tinymce 新增图片上传

### 🐛 Bug Fixes

- 修复表格列配置已知问题
- 恢复 table 的`isTreeTable`属性
- 修复表格内存溢出问题
- 修复`layout` 收缩展开功能在分割模式下失效
- 修复 modal 高度计算错误
- 修复文件上传错误
- 修复表格已知问题

### 🎫 Chores

- 文档更新

## 2.0.0-rc.15 (2020-12-31)

### ✨ 表格破坏性更新

- 重构了可编辑单元格及可编辑行。具体看示例。写法已改变。针对可编辑表格。

- 表格编辑支持表单校验

- 在表格列配置增加了以下配置

```bash
{

  # 默认是否显示列。不显示的可以在列配置打开
  defaultHidden?: boolean;
  # 列头右侧帮助文本
  helpMessage?: string | string[];
  # 自定义格式化 单元格内容。 支持时间/枚举自动转化
  format?: CellFormat;

  # Editable
  # 是否是可编辑单元格
  edit?: boolean;
  # 是否是可编辑行
  editRow?: boolean;
  # 编辑状态。
  editable?: boolean;
  #  编辑组件
  editComponent?: ComponentType;
  # 所对应组件的参数
  editComponentProps?: Recordable;
  # 校验
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  # 值枚举转化
  editValueMap?: (value: any) => string;
  # 触发编辑正航
  record.onEditRow?: () => void;
}

```

### ✨ 表格重构

- 新增`clickToRowSelect`属性。用于控制点击行是否选中勾选框
- 监听行点击事件
- 表格列配置按钮增加 列拖拽，列固定功能。
- 表格列配置新增`defaultHidden` 属性。用于默认隐藏。可在表格列配置勾选显示
- 更强大的列配置
- useTable:支持动态改变参数。可以传入`Ref`类型与`Computed`类型进行动态更改
- useTable:新增返回 `getForm`函数。可以用于操作表格内的表单
- 修复表格已知的问题

### ✨ Features

- 新增 `v-ripple`水波纹指令
- 新增左侧菜单混合模式
- 新增 markdown 嵌入表单内示例
- 新增主框架外页面示例
- `route.meta` 新增`currentActiveMenu`,`hideTab`,`hideMenu`参数 用于控制详情页面包屑级菜单显示隐藏。
- 新增面包屑导航示例
- form: 新增`suffix`属性，用于配置后缀内容
- form: 新增远程下拉`ApiSelect`及示例
- form: 新增`autoFocusFirstItem`配置。用于配置是否聚焦表单第一个输入框
- useForm: 支持动态改变参数。可以传入`Ref`类型与`Computed`类型进行动态更改

### ⚡ Performance Improvements

- 优化`modal`与`drawer`滚动条组件
- table: 移除 `isTreeTable`属性
- 全局引入`less`文件。无需手动在组件再次引入

### 🎫 Chores

- 升级`ant-design-vue`到`2.0.0-rc.7`
- 升级`vue`到`3.0.5`

### 🐛 Bug Fixes

- 修复混合模式下滚动条丢失问题
- 修复环境变量配置失效以及 history 模式下 logo 地址问题
- 修复图表库切换页面导致宽高计算错误
- 修复多语言配置 `Locale.show`导致配置不生效
- 修复路由类型错误
- 修复菜单分割时权限失效问题
- 关闭多标签页时 iframe 提前加载
- 修复`modal`与`drawer`已知问题
- 修复左侧菜单混合模式适配问题

## 2.0.0-rc.14 (2020-12-15)

### ✨ Features

- 移除左侧菜单搜索，新增顶部菜单搜索功能
- layout 移动端适配。业务页面未适配
- axios 加入 joinTime 配置。控制响应是否加入时间戳

### ⚡ Performance Improvements

- 异步引入组件
- 优化整体结构
- 替换菜单默认滚动条为滚动组件
- 菜单性能优化

### 🎫 Chores

- 返回顶部样式调整,避免遮住其他元素
- 升级`ant-design-vue`到`2.0.0-rc.5`
- 刷新按钮布局调整
- `route.meta` 移除 `externalLink` 属性

### ✨ Refactor

- `openModal`与`openDrawer`第三个参数`openOnSet`默认设置为 true

### 🐛 Bug Fixes

- 修复多级路由缓存导致组件渲染多次的问题
- 修复地图图表切换后消失问题
- 修复登录成功 notify 消失问题
- 修改 `VirtualScroll`和`ImportExcel`组件名为`VScroll`与`ImpExcel`,暂时解决含有关键字的组件在 vue 模版内使用内存溢出
- 修复 axios 大小写问题
- 修复按钮样式问题
- 修复菜单分割模式问题
- 修复 `Modal`与`Drawer`组件在使用 emits 数据传递失效问题
- 修复菜单已知问题
- 修复上传组件 api 失效问题
- 修复菜单权限过滤失效问题

## 2.0.0-rc.13 (2020-12-10)

## (破坏性更新) Breaking changes

- 路由重构, 不再支持以前的格式。改为支持 vue-router 最初的默认结构，具体格式可以参考示例更改。实现多级路由缓存，不再将路由转化为 2 级。
- 重构面包屑，使用 antd 的面包屑组件。之前的组件已删除

### ✨ Features

- 还原 antdv 默认 loading，重构 `Loading` 组件，增加`useLoading`和`v-loading`指令。并增加示例
- i18n 支持 vscode `i18n-ally`插件
- 新增多级路由缓存示例
- 打包代码拆分(试验)
- 提取上传地址到全局变量，打包可以动态配置

### ✨ Refactor

- tree 组件 ref 函数调用删除 `$`
- 锁屏界面重构美化，删除不必要的背景图片

### ⚡ Performance Improvements

- 页面切换 loading 逻辑修改。对于已经加载过的页面不管有没有关闭,再次打开不会在显示 loading(已经打开过的页面再次打开速度比较快,可以不需要 loading,同理顶部进度条逻辑也一样)，刷新后恢复。

### 🎫 Chores

- 首屏 loading 修改
- 升级`vue`到`3.0.4`
- 升级`ant-design-vue`到`2.0.0-rc.3`
- 重新引入`vueuse`
- 移除 route meta 内的`afterCloseLoading`属性
- 文档更新

### 🐛 Bug Fixes

- 修复表格 i18n 错误
- 修复菜单图标大小不一致
- 修复顶部菜单宽度计算问题
- 修复表格 tabSetting 问题
- 修复文件上传删除失效
- 修复表格行编辑保存错误问题

## 2.0.0-rc.12 (2020-11-30)

## (破坏性更新) Breaking changes

- ClickOutSide 组件引入方式由 `import ClickOutSide from '/@/components/ClickOutSide/index.vue'`变更为`import { ClickOutSide } from '/@/components/ClickOutSide'`
- Button 组件引入方式由 `import Button from '/@/components/Button/index.vue'`变更为`import { Button } from '/@/components/Button'`
- StrengthMeter 组件引入方式由 `import StrengthMeter from '/@/components/StrengthMeter'`变更为`import { StrengthMeter } from '/@/components/StrengthMeter'`
- 除示例外加入全局国际化功能，支持中文与英文

### ✨ Refactor

- 重构整体 layout。更改代码实现方式。代码更精简
- 配置项重构
- 移除 messageSetting 配置
- BasicTitle 组件 `showSpan`=> `span`

### ✨ Features

- 缓存可以配置是否加密,默认生产环境开启 Aes 加密
- 新增标签页拖拽排序
- 新增 LayoutFooter.默认显示，可以在配置内关闭

### ⚡ Performance Improvements

- 优化`Modal`组件全屏动画不流畅问题

### 🐛 Bug Fixes

- tree: 修复文本超出挡住操作按钮问题
- useRedo: 修复通过 useRedo 刷新页面参数丢失问题
- form: 修复表单校验先设置在校验及控制台错误信息问题
- `modal`&`drawer` 修复组件传递数组参数问题
- form: 修复`updateSchema`赋值含有`[]`时不生效
- table: 修复表格 `TableAction` 图标显示问题
- table: 修复表格列设置通过`setColumns`设置不显示

### 🎫 Chores

- 更新 antdv 到`2.0.0-rc.2`
- 更新 vue 到`3.0.3`
- 更新 vite 到`1.0.0.rc13`
- 暂时删除 `@vueuse/core`.等稳定后在集成。目前不太稳定。

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
