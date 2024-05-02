## 2.8.0(2021-11.03)

### Upgrade Instructions

- Package manager changed from `yarn` to `pnpm`
- Delete `node_modules` and `yarn.lock`, install `pnpm` globally
- Execute `pnpm install`

### ✨ Features

- **Others**
  - The `VITE_PROXY` configuration in the `.env` file supports single quotes
  - Remove warnings during build

### 🐛 Bug Fixes

- **BasicTable**
  - Fix the issue that editable cells cannot be submitted in some cases
  - Fix the problem that the `inset` attribute does not work
  - Fix the problem that the performance of `useTable` and `reload` method `await` of `BasicTable` instance are inconsistent
  - Fix the issue that `clickToRowSelect` would ignore the disabled state of the row selection box
  - Fix the problem that the page of `BasicTable` will be reset in some cases
  - Modify the `deleteTableDataRecord` method
- **BasicModal**
  - Fixed the problem that `Modal` could not be closed even when clicking on the mask and pressing the `Esc` key
  - Fixed the issue that clicking the close button and the blank area next to the maximize button would also cause `Modal` to close
- **BasicTree** Fix the problem that the node slot does not work
- **CodeEditor** Fix the problem that may cause `Build` failure
- **BasicForm** Fix the problem that the content width of the custom FormItem component may be out of range
- **ApiTreeSelect** Fix the problem that the change of `params` failed to trigger the re-request of api data
- **Others** -Fixed an issue where multiple tabs would not jump to routing when closing tabs in some cases
  - Fix the issue that some components may cause abnormal hot update
  - Fix the problem that some sub-components of `antdv` will be reported in the build process when directly `import` part of the `antdv`, such as: TabPane, RadioGroup

## 2.7.2(2021-09-14)

### ✨ Features

- **BasicForm** New `Divider` in the form component for dividing the area of longer forms
- **BasicTable**
  - Cell editor adds submit callback, which will decide whether to submit data to the form based on the result returned by the callback function
  - Add check method for row editing, allowing only check but not submit value, so asynchronously save data successfully before submit to table
  - Fix the problem that the `rowClassName` property cannot be used at the same time as `striped`.
- New component **MarkdownViewer** for displaying rich text in Markdown format

### 🐛 Bug Fixes

- **CodeEditor** Fix JSON editor throwing exception when formatting invalid JSON text
- **Tinymce** fixes an issue where inline mode throws an exception in some scenarios
- **BasicTable**
  - Repair the problem that the editing icon is not displayed when the content of editable cell is empty
  - Repair the problem that the total row at the end of the table sometimes fails to align with the columns in the main part of the table.
- **MarkDown** Repair the problem that the value of initial value property does not work.
- **BasicUpload** Repair the problem that `accept` property does not support `MIME` and suffix name starting with dot.
- **ApiSelect** Fix the problem of type definition of `value` property.
- **Other**
  - Repair the problem that some wrapper components give error when using slots.
  - Repair the problem that `theme` parameter of `useECharts` does not work.
  - Repair the problem that when `Token` is invalid, pressing F5 to refresh the page may cause abnormal page loading.
  - Repair the problem that the improper call of `useRedo` may lead to `path` redirection abnormality.
  - Repair the problem that `vite` custom mode name does not support underscore.

## 2.7.1(2021-08-16)

- Upgrade vue 3.2, if the operation fails, delete node_modules and reinstall it

### ✨ Features

- **BasicTree** Add search function related properties and methods
- **BasicForm** added `alwaysShowLines` to set the number of lines kept displayed when folding

### 🐛 Bug Fixes

- **Cropper** Fix the problem of failure to destroy in time
- **BasicTable**
  - Fix the problem that `CellFormat` cannot use `Map` type data
  - Fixed an issue where the editable cell failed to display the `0` value correctly
  - Fixed the issue that selection-change event failed to trigger correctly when unchecked
  - Fix the problem that the background color of the full screen state under the light theme is incorrect
  - Fix the problem of obtaining complete data when `getSelectRows` does not support remote data cross-page selection
  - Fix the issue that the `size` property provided for editing components in `editComponentProps` is invalid
- **Qrcode** Fixed the problem that the QR code component could not be drawn in time when it was created
- **BasicModal** Fix the problem that the `helpMessage` property does not work
- **BasicButton** Fix the problem that the button style performance is inconsistent with the official antd
- **Others** Fix the problem that `useRedo` (reload the current route) will lose route `params` data

## 2.7.0(2021-08-03)

## (Breaking changes) Breaking changes

- Restore the project `tailwindcss` back to `windicss`, tried `tailwindcss`, there may be a lot of problems, first switch back to `windicss` to improve development efficiency and lower switching costs.
  - There are currently incompatible areas of the project
    - The wording of `xl:!m-4` needs to be changed to `!xl:m-4`, note that only `!` is incompatible. If you don’t use it, you don’t need to change it.
    - The memory overflow problem may still exist (low frequency, just restart, restart vite faster)

### ✨ Features

- **Preview** Add new properties and events
- **Dark Theme** added support for tailwindcss night mode
- **Others** add setTip method for useLoading

### 🐛 Bug Fixes

- **ApiTreeSelect** Fixed the problem of failing to monitor `params` changes correctly
- **ImgRotateDragVerify** Fix the problem that the component `resume` method cannot be called
- **TableAction** Fix the problem that the stopButtonPropagation property does not work in some cases
- **PageWrapper** Fix the problem of invalid `class` attribute
- **BasicTree** Fix the problem that the `checkAll` method will affect the `disabled` state node
- **BasicTable**
  - Fix the issue that editable cells do not support `ellipsis` configuration
  - Fixed the problem that the pop-up layer of sub-components (popconfirm and edit components such as select and treeSelect) cannot be seen in full-screen mode
  - Fixed an issue where when `expandRowByClick` is enabled, clicking non-expandable rows may cause style errors
  - Fix the problem that the dynamic change of `pagination` property does not take effect
  - Fix the problem that `getSelectRows` does not support the child data of the tree table -**Dark Theme** Fix the color matching problem under the dark theme
  - Fix the background color of the selected node of the `Tree` component
  - Fix the color configuration of the `Alert` component
  - Fix the problem of the button color of `link` type in the disabled state
  - Fix the style problem of checked checkboxes in `Tree` -**Others** Fix the problem that useScript failed to automatically remove the script node

## 2.6.1(2021-07-19)

### ✨ Features

- **NoticeList** Add pagination, auto omit for overlength, title click event, title strikethrough, etc.
- **MixSider** Optimize the style of the bottom collapse button in the Mix menu layout to be consistent with the style of other menu layouts
- **ApiTreeSelect** Extend `TreeSelect` component of `antdv` to support remote data source, similar to `ApiSelect`.
- **BasicTable** New `ApiTreeSelect` editing component
- Different backend home pages can be specified for different users.
  - Add `homePath` field (optional) to the user information returned by the `getUserInfo` interface to customize the home page path for the current user

### 🐛 Bug Fixes

- **BasicTable**
  - Fix scrollbar style issue (removed scroll style patch)
  - Fix the alignment problem of cells with expanded icons in tree tables
  - Add `headerTop` slot.
  - Fix the color display of the operation column button in disabled state.
  - Repair the problem that the values of editable cells cannot be updated by modifying `dataSource` directly.
  - Repair the problem of data replay when using `ApiSelect` to edit components.
  - Repair the problem that editing components may report `onXXX` type error in some scenarios.
- **TableAction**
  - Create Tooltip component only if `action.tooltip` exists.
  - Fix the problem that the content of the round button inside the component is not centered
- **AppSearch** Fix the problem that the hidden menu may be searched.
- **BasicUpload** Repair the problem of error when handling non-`array` values.
- **Form** Repair the `suffix` slot style problem of `FormItem`.
- **Menu**
  - Repair the hovering trigger logic of the left mixed menu
  - Repair the problem that the top bar menu is wrong when displaying menu items that need to be hidden.
  - Fix the left mixed menu in hover trigger mode will jump to route directly when there is no submenu and it is activated
- **Breadcrumb** Repair the problem that the menu with redirection cannot be jumped when clicked
- **Markdown** fixes an initialization exception and an issue where value was not set dynamically correctly
- **Modal** Make sure props are passed correctly
- **MultipleTab** fixes an issue that could accidentally create login route tabs
- **BasicTree** Fix the problem that the search function may cause `checkedKeys` to be lost
- **CodeEditor** Fix the problem that value does not support v-model usage.
- **CountdownInput** Fix the problem that `input` slot is not supported.
- **ApiSelect** Fix the problem that the `options-change` event parameter is not the standard `options` data used by `select
- **Other**
  - Fix the problem that the configuration of default menu collapse does not work
  - Repair the problem that `safari` browser reports an error and the website cannot be opened.
  - Repair the problem that eslint keeps error due to endOfLine after pulling the code on window.
  - Fix `Vue Router warn` caused by dynamic routing

### 🎫 Chores

- Add test environment test command

## 2.6.0(2021-07-04)

### ✨ Features

- **Axios** New `withToken` configuration to control whether the request carries a token or not
- **BasicUpload**
  - New `preview-delete` event triggered when deleting a file in preview `Modal`.
  - `value` supports `v-model` usage
- **Route configuration**
  - Add `ignoreRoute` to generate menu only in `ROUTE_MAPPING` or `BACK` permission mode
  - Add `hidePathForChildren` configuration to ignore this level `path` when generating menus for child items
- **TableAction** Add `tooltip` configuration to add tooltip hint for button
- **CropperAvatar**
  - Added `value` to set the current avatar
  - Added `onChange` to accept avatar cropping and upload success event
  - New `btnText`, `btnProps` for customizing the text and properties of the upload button
  - Add tooltips to the action buttons in `Modal` for cropping
- **Modal** Add tooltip for action button in top right corner

### 🐛 Bug Fixes

- **Modal**
  - Fix the problem that the mask cannot be closed by clicking on it.
  - Fix `setModalProps` does not support setting `defaultFullscreen`.
- **Table**
  - Fix the problem that `editComponentProps` doesn't support `onChange`.
  - Fix the problem that `selection-change` event is not triggered when `clickToRowSelect` is enabled.
  - Fix the problem that global configuration `fetchSetting` may be accidentally modified by local configuration.
  - Fix the problem that the parameter of `handleSearchInfoFn` contains redundant blank keys.
  - Repair the problem that when rowSelection.onChange is provided for table, the selected items of table cannot be changed manually.
  - Fix the problem that the scrollbar continues to be displayed even when it is not needed to be displayed.
- **Icon** Repair the problem that SvgIcon is missing some styles.
- **Menu**
  - Repair the problem that single-level menu refreshing will not be activated in route mapping mode.
  - Repair the problem that the collapse customization at the bottom of the side menu is invalid.
- **Form** Repair the type definition of `submitButtonOptions` and `resetButtonOptions`.
- **PopConfirmButton** Remove the redundant `title` on `Button`.
- **Axios** Fix the problem that `params` and `data` data cannot be submitted at the same time when non-`GET` requests are made
- **Other**
  - Repair the problem that the lock screen function can skip the lock state by refreshing the page or copying the URL to open a new browser tab
  - Repair the problem that `Token` won't be synchronized when multiple windows open pages at the same time.
  - Repair the problem that `hasPermission` does not work in `ROLE` permission mode.
- **Table** Repair the problem that the parameter of `handleSearchInfoFn` contains extra blank keys.
- **Tailwindcss** Remove console warning

## 2.5.2(2021-06-27)

### ⚡ Performance Improvements

- **Icon** Remove the global registration of Icon components to prevent hot update issues under certain circumstances

### ✨ Features

- **Menu** Added `permissionMode=PermissionModeEnum.ROUTE_MAPPING` mode
  - The project is changed to this mode by default, and the original menu file is deleted
  - If you have written the menu before, you can change to `PermissionModeEnum.ROLE` mode

## 2.5.1(2021-06-26)

### ⚡ Performance Improvements

- Upgrade `vue` and `ant-design-vue` versions to solve compatibility issues
- **Tree** Performance optimization

### 🐛 Bug Fixes

- **Table** Fix page jitter problem
- **Upload** Make sure to carry custom parameters
- **Dropdown** Fix the icon display problem of popConfirm
- **Table** Fix the problem that the editing event of the tree table is abnormal
- **Table** Fix the problem that when the table data is empty, the value returned by getDataSource is not the data source used by the table

## 2.5.0(2021-06-20)

## (Breaking changes) Breaking changes

- Change the project `windicss` to `tailwindcss` to solve the memory overflow problem
  - There are currently incompatible areas of the project
    - The wording of `!xl:m-4` needs to be changed to `xl:!m-4`, note that only `!` is incompatible. If you don’t use it, you don’t need to change it.
    - The new features of `windicss` itself need to be adjusted, for example, `Attribute` mode is not compatible

### ✨ Refactor

- Remove `useExpose` and use `expose` provided by the component itself instead

### ⚡ Performance Improvements

- **Locale** merge multi-language files to reduce the number of files
- **Utils** Mitt default export is changed from `Class` to `Function`
- **Axios** `isTransformRequestResult` is renamed to `isTransformResponse`

### ✨ Features

- **CropperImage** `Cropper` Avatar cropping adds circular cropping function
- **CropperAvatar** Added avatar upload component
- **Drawer** `useDrawer` added `closeDrawer` function
- **Preview** Added `createImgPreview` picture preview function
- **Setup** New guide page example
- **Tests** Add jest test suite, Vue component single test is not currently supported
- **Axios** Added `authenticationScheme` configuration to specify the authentication scheme
- **Setting** Added `sessionTimeoutProcessing` project configuration item, used to configure how to deal with session timeout

### 🐛 Bug Fixes

- **Modal** fix full screen height calculation error
- **Modal** Fix the problem that the shutdown event is triggered multiple times
- **PageWrapper** fix the height calculation problem
- **FlowChart** Repair drag and drop menu missing
- Fixed Iframe routing error in background mode
- **PageWrapper** Fix the height calculation problem when footer and global footer are opened at the same time
- **Menu** Fix the jitter problem of menu folding animation
- **Store** fixed type error after pinia version upgrade

## 2.4.2(2021-06-10)

### ✨ Refactor

- `CountTo` component refactoring

### ✨ Features

- `radioButtonGroup` supports `boolean` value
- `useModalInner` added `redoModalHeight` to reset the height of `Modal` inside Modal
- `useECharts` added `getInstance` to obtain instances of `echart`
- `TableAction` added `stopButtonPropagation` to prevent the action button click event from bubbling
- `BasicTable` in the row edit mode, you can get or set the value of other editing components in the column
- The `ApiSelect` component will automatically re-fetch the data after the `params` is changed
- `TableImg` component improvement
- `BasicTable` added `columns-change` event to monitor the user to change the sorting, display, and fixed status of columns
- `Tinymce` supports dynamic modification readonly
- `BasicTable` added `updateTableDataRecord` method to update the specified row data
- `useModal` added `closeModal` method to close `Modal`

### 🐛 Bug Fixes

- Fix the problem that `redoModalHeight` cannot reduce the height
- Fix the problem that the schema data of `BasicForm` does not take effect
- Fix the problem that multiple tags may cause `KeepAlive` to fail
- Fix the problem that the default `axios` interceptor cannot handle custom code
- Fix the height issue of the lock screen pop-up window
- Fixed the problem that the half-selected state of the `Column Display` checkbox of `BaiscTable` was incorrectly displayed
- Fixed the problem that the preview list of the `BasicUpload` component could not be displayed in some cases
<<<<<<< HEAD
- Fix the problem that the `options` setting of `RadioButtonGroup``disabled` does not take effect
=======
- Fix the problem that the `options` setting of ` RadioButtonGroup``disabled ` does not take effect
>>>>>>> 76935b4e (first commit)
- Fix the problem that the button for uploading pictures in the read-only mode of the `Tinymce` component is still available
- Fix the stuttering problem of `BasicForm` under certain circumstances
- Fix the problem that "directory" routing does not work

## 2.4.1(2021-06-01)

### ✨ Features

- Add `DatePicker` and `TimePicker` components to editable tables
- Added `defaultExpandLevel` configuration to `Tree` component

### ⚡ Performance Improvements

-Menu search default focus

### 🐛 Bug Fixes

- Fix known issues of `CodeEditor`
- Fix the issue of `i18n` console warning
- Fix the problem that the editable table `align` configuration does not take effect
- Ensure that `axios` only processes `Object` parameters
- Fix the failure of the `defaultExpandAll` configuration of the `Tree` component
- Fix the problem of missing dividing line in `TableAction`
- Fix the known issues of the table
- Fix that the lang attribute of HTML will not be set when reloading due to the first loading or changing the language

## 2.4.0 (2021-05-25)

### ✨ Features

-New graphical editor example -New code editor (including Json editor) -Added `JsonPreview`Json data viewing component -The fields of the data column and actionColumn of the table can be controlled according to the authority and business. -Added an example of a permission control table (AuthColumn.vue) -Added user login expiration example

### ⚡ Performance Improvements

-Consolidate some language files to reduce the number of files

### 🐛 Bug Fixes

-Fix the flashing white screen when the dark theme refreshes -Fix the problem that other functions are invalid when the tab is closed -Fix known issues in the form -Fix the automatic lock screen failure

## 2.3.0 (2021-04-10)

## (Breaking changes) Breaking changes

- Use `pinia` to replace `vuex`, `vuex-module-decorators`.

  -Impact, if you used vuex-module-decorators yourself before, you need to transform it to pinia.

  - the reason: -pinia is basically similar to vuex5api and is easy to understand. -Subsequent switching to vuex5 has a very low cost and can also be used as a third-party state management library

- Remove `useKeyPress` and use `vueuse`-`onKeyStroke` instead
- Remove `useDebounceFn` and use `vueuse`-`useDebounceFn` instead
- Remove `useThrottle` and use `vueuse`-`useThrottleFn` instead

### ✨ Features

- Tabs support persistent storage

### ✨ Refactor

- Remove `useElResize`

### 🐛 Bug Fixes

- Login page style fix
- Fix the known problems of the menu
- Fix the problem of theme style switching

## 2.2.0 (2021-04-06)

### ✨ Features

- Added `headerTitle` slot
- New printing example
- Added about interface

### ✨ Refactor

- Remove useFullScreen function
- tinymce changed from Cdn to npm (the package size is too large)
- Dashboard refactoring
- Remove ApexCharts and examples

### 🐛 Bug Fixes

- Make sure the breadcrumbs are displayed correctly
- Fixed the issue of tinymce upload button disappearing in full screen mode
- Make sure that the title changes normally after logging in again
- Ensure that the background mode login is normal
- Fix TableAction click event issue

## 2.1.1 (2021-03-26)

### ✨ Features

- Added hideChildrenInMenu configuration for routing. Used to hide submenu
- Built-in expand/collapse all functions in the tree form

### ✨ Refactor

- Refactor the routing multi-layer mode to solve the problem of multiple implementations of nested keepalives

### 🐛 Bug Fixes

- Ensure that the CountDownInput component is reset to the empty value
- Fix the display problem on the small screen in split mode
- Fix table height calculation problem
- Fix the problem that components cannot be obtained by background routing
- Fix Modal component loadingTip configuration does not take effect
- Fix the background permission command does not take effect
- Make sure the progress bar is closed properly
- Fix the problem of invalid table check column configuration
- Ensure that the first level menu can be hidden
- Ensure that the hidden fields of the form are verified properly

### 🎫 Chores

- Remove ls-lint

### 🎫 Chores

- 移除 ls-lint

## 2.1.0 (2021-03-15)

### ✨ Features

- Added svg mode to icon selector
- Added time component
- Added AutoNavi/Baidu/Google Map example

### ✨ Refactor

- Refactor the project to solve the hot update problem caused by circular dependencies
- Remove vueHelper/useClickoutside, use @vueuse/core instead

### 🐛 Bug Fixes

- Ensure that the value of `table action` is updated correctly
- Fix the animation of page switching cannot be closed
- Fix `PageWrapper`title not showing
- Fix the known issues of the table
- Fix the problem that the BasicTree component can't customize the title
- Fix the button style problem after theme switching

## 2.0.3 (2021-03-07)

### ✨ Features

- `BasicTree` added `clickRowToExpand`, used to click tree node to expand
- Added SvgIcon plugin and examples
- Add the department tree on the left side of the account management interface·

### ⚡ Performance Improvements

- Pagination parameters are no longer carried when the table is closed
- The login page monitors the carriage return event to log in
- When the adaptive size of the table is set, the height is filled according to the screen.
- Tree scroll bar optimization
- Optimize the loading speed of local development

### 🐛 Bug Fixes

- Fix known issues with `Description`
- Fix known issues with `BasicForm`
- Fix the logic problem of show attribute of ActionItem under `BasicTree`
- Fix the style error of the tree component demo example
- Repair account management to add new but not cleared old data
- The form component should allow the setFieldsValue method to be null or undefined
- Ensure that the single-level breadcrumbs jump correctly
- Ensure that the Form component does not verify hidden form items

## 2.0.2 (2021-03-04)

### ✨ Refactor

- Refactored multi-language modules to support lazy loading and remote loading

### ✨ Features

- axios supports form-data format request
- Added icon selector component (support local and online methods)
- Added WebSocket examples and service scripts
- Added the `renderIcon` property to the Tree component to control the display of level icons
- Tree->actionItem added show attribute, used to dynamically control button display
- New toolbar/title/search function for Tree
- Added department management/password modification/account management/role management/menu management sample interface

### ⚡ Performance Improvements

- Optimized login interface animation
- Fix the problem of excessively large github warehouse.
- Hide table full screen button by default
- `crypto-es` is changed to `crypto-js` to reduce the package size
- `types` directory moved to the root directory, compatible with other directory global types

### 🐛 Bug Fixes

- Fix the warning problem of verification code component
- Fix the table cannot get the selected row correctly
- Fixed modal height calculation error in full screen state
- Fix some table style issues
- Fix the invalidation of the tree form `indentSize` setting

## 2.0.1 (2021-02-21)

### ✨ Refactor

- Refactored login page, new registration page/reset password page/mobile phone login/QR code login

### ✨ Features

- Added the `settingButtonPosition` configuration item for configuring the position of the `settings` button
- `modal` can switch the full screen by double-clicking the head
- Added `CountDownInput` component

### ⚡ Performance Improvements

- Optimize the editable center style and the width of the drop-down box is too short
- The `edit-change` event listener when the table is added and edited

### 🐛 Bug Fixes

- Fix image preview style error
- Fix icon style problem
- Fix the drop-down echo problem of editable table

## 2.0.0 (2021-02-18)

## Breaking changes

- `echarts` is upgraded to 5.0 and introduced on demand (just use `useECharts`).

### ✨ Refactor

- Removed `global.less`, `mixin.less`, `design/helper`, replaced by `windicss`, and need to modify the corresponding styles if they are useful

### ✨ Features

- useModal adds the return value function `redoModalHeight`, which is used to refresh the modal height when the modal is dynamic content
- Upgrade husky to 5.0
- Added `brotli`|`gzip` compression and related test commands
- Re-introduction of `windicss` (same as `tailwind`). Faster in speed

### ⚡ Performance Improvements

- Adjust the return value of the interface to obtain user information in array format
- Fix the error-log list as the system route

### 🐛 Bug Fixes

- Fix the issue of upload component maxNumber invalid
- Fix package sourcemap error report
- Fix code debugger location display error
- Fix the issue of mock plugin post request error
- Fix some themes color value error
- Fix the table in editable row status and press Enter to confirm

### 🎫 Chores

- Documentation update
- Upgrade ant-design-vue to `2.0.0`
- Upgrade vite to `2.0.0`

## 2.0.0-rc.18 (2021-02-05)

### ✨ Features

- `ApiSelect` adds `numberToString` property, which is used to convert all the value of `number` into `string`
- Added theme color switch
- Packed image compression

### ⚡ Performance Improvements

When mock is not used, move `mock.js` out of the package file

### 🐛 Bug Fixes

- Fix modal height calculation error
- Fix the pop-up menu when the menu is clicked on the tab when the menu is collapsed
- Fix the problem that the initial value of form is 0
- Fix table wrapping problem
- Fix the menu outside link does not jump
- Fix the display problem at the top of the menu
- Fix the issue of `modifyVars` configuration failure

## 2.0.0-rc.17 (2020-01-18)

### ✨ Refactor

- Added `SimpleMenu` component to replace the left menu component (the top menu is not replaced, the function should be as simple as possible without stuck). Solve the menu stuck problem.
- The `ant-design-vue` component is no longer registered globally. In order to better coordinate with the introduction of css on demand. If you need to register globally, you need to add it yourself

### ✨ Features

- `css` import on demand

### 🐛 Bug Fixes

- Fix `TableAction` icon problem
- Fix the problem of missing menu folding buttons
- Fix menu related issues
- Fix moment multilingual issue

## 2.0.0-rc.16 (2020-01-12)

### ✨ Refactor

- Independent component configuration to `/@/settings/componentsSetting`
- `colorSetting` and `designSetting` are now merged into `designSetting`
- `ant-design-vue` component registration moved to `components/registerComponent`
- Remove the `setup` folder
- Upgrade to `vite2`
- Image preview is changed to `Image` component implementation, temporarily removing functional usage

### ✨ Features

- Added `mixSideTrigger` configuration. Used to configure how to open the mixed mode menu on the left. Optional `hover`, default `click`
- Added `mixSideFixed` configuration. Used to fix the left mixed mode menu
- Added `height` and `min-height` properties to the modal component
- Added `PageWrapper` component. And applied to the sample page
- Added tab folding function
- Compatible with older browsers
- tinymce new image upload

### 🐛 Bug Fixes

- Fix known issues with table column configuration
- Restore the `isTreeTable` property of the table
- Fix table memory overflow problem
- Fix the function of `layout` shrinking and expanding in split mode
- Fix modal height calculation error
- Fix file upload error

## 2.0.0-rc.15 (2020-12-31)

### ✨ Table destructive update

- Refactored editable cells and editable rows. See examples for details. The writing has changed. For editable tables.

- Form editing supports form validation

- Added the following configuration in the table column configuration

```bash
{

  # Whether to display columns by default. Those that are not displayed can be opened in the column configuration
  defaultHidden?: boolean;
  # Help text on the right side of the column header
  helpMessage?: string | string[];
  # Custom formatting Cell content. Support time/enumeration automatic conversion
  format?: CellFormat;

  # Editable
  # Is it an editable cell
  edit?: boolean;
  # Is it an editable line
  editRow?: boolean;
  # Edit status.
  editable?: boolean;
  # Edit component
  editComponent?: ComponentType;
  # The parameters of the corresponding component
  editComponentProps?: Recordable;
  # Check
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  # Value enumeration conversion
  editValueMap?: (value: any) => string;
  # Trigger editing Zhenghang
  record.onEditRow?: () => void;
}

```

### ✨ Table reconstruction

- Added `clickToRowSelect` attribute. Used to control whether the clicked row is checked or not
- Monitor row click event
- Add column drag and drop and column fix function for the table column configuration button.
- Added `defaultHidden` attribute to table column configuration. Used to hide by default. You can configure the tick display in the table column
- More powerful column configuration
- useTable: Support for dynamically changing parameters. You can pass in `Ref` type and `Computed` type for dynamic changes
- useTable: Added return function `getForm`. Can be used to manipulate forms in the form Fix known issues in the table

### ✨ Features

- Added `v-ripple` water ripple command
- Added the left menu mixed mode
- Add an example of markdown embedded in the form
- Add an example of a page outside the main frame
- `route.meta` added `currentActiveMenu`, `hideTab`, and `hideMenu` parameters to control the display and hide of the crumb-level menu on the detail page.
- Added breadcrumb navigation example
- form: Added `suffix` attribute to configure suffix content
- form: Added remote drop-down `ApiSelect` and examples
- form: Add `autoFocusFirstItem` configuration. Used to configure whether to focus on the first input box of the form
- useForm: Support for dynamically changing parameters. You can pass in `Ref` type and `Computed` type for dynamic changes

### ⚡ Performance Improvements

- Optimize the scroll bar components of `modal` and `drawer`
- table: remove the `isTreeTable` attribute
- Import `less` files globally. No need to manually re-introduce the component

### 🎫 Chores

- Upgrade `ant-design-vue` to `2.0.0-rc.7`
- Upgrade `vue` to `3.0.5`

### 🐛 Bug Fixes

- Fixed the issue of missing scroll bars in mixed mode
- Fix the invalid configuration of environment variables and the logo address problem in history mode
- Fix the calculation error of width and height caused by switching page of chart library
- Fixed the issue of multi-language configuration `Locale.show` causing the configuration not to take effect
- Fix routing type error
- Fix the problem of invalid permissions when the menu is split
- Iframe loads early when closing multi-tab pages
- Fix known issues with `modal` and `drawer`
- Fix the problem of mixing mode adaptation in the left menu

## 2.0.0-rc.14 (2020-12-15)

### ✨ Features

-Remove the left menu search, add the top menu search function -Layout mobile terminal adaptation. Business page is not adapted -axios join the joinTime configuration. Control whether the response includes a timestamp

### ⚡ Performance Improvements

-Import components asynchronously -Optimize the overall structure -Replace the default scroll bar of the menu as a scroll component -Menu performance optimization

### 🎫 Chores

-Return to the top to adjust the style to avoid covering other elements -Upgrade `ant-design-vue` to `2.0.0-rc.5` -Refresh button layout adjustment -`route.meta` removes the `externalLink` attribute

### ✨ Refactor

-`openModal` and `openDrawer` third parameter `openOnSet` is set to true by default

### 🐛 Bug Fixes

-Fixed an issue where multi-level routing cache caused components to render multiple times -Fixed the problem of disappearing after switching the map chart -Fix the issue of successful login and notify disappearing -Modify the names of `VirtualScroll` and `ImportExcel` components as `VScroll` and `ImpExcel` to temporarily solve the memory overflow of components containing keywords in the vue template -Fix axios case problem -Fix button style problem -Fix the problem of menu split mode -Fix the issue of invalid data transmission when using emits in `Modal` and `Drawer` components -Fix the known problems of the menu -Fix the issue of upload component api failure -Fix the problem of invalid menu permission filtering

## 2.0.0-rc.13 (2020-12-10)

## (Breaking changes) Breaking changes

-Route reconstruction, the previous format is no longer supported. Change to support the original default structure of vue-router, the specific format can be changed by referring to the example. Realize multi-level route caching, and no longer convert routes to level 2. -Refactor breadcrumbs and use antd's breadcrumbs component. The previous component has been deleted

### ✨ Features

-Restore the default loading of antdv, refactor the `Loading` component, and add `useLoading` and `v-loading` instructions. And add examples -i18n supports vscode `i18n-ally` plugin -New examples of increased routing cache -Packaged code split (experimental) -Extract upload address to global variable, package can be dynamically configured

### ✨ Refactor

-Tree component ref function call to delete `$` -Reconstruction and beautification of the lock screen interface, delete unnecessary background pictures

### ⚡ Performance Improvements

-Page switching loading logic modification. Regardless of whether the loaded page is closed or not, loading will not be displayed when opened again (pages that have been opened are opened again faster, and loading is not required, and the logic of the top progress bar is the same), and it will be restored after refreshing.

### 🎫 Chores

-First screen loading modification -Upgrade `vue` to `3.0.4` -Upgrade `ant-design-vue` to `2.0.0-rc.3` -Re-introduction of `vueuse` -Remove the `afterCloseLoading` attribute in route meta -Documentation update

### 🐛 Bug Fixes

-Fix form i18n error -Fix the inconsistent size of menu icons -Fix the calculation of the top menu width -Fix table tabSetting problem -Repair file upload and delete invalidation -Fix the problem of editing and saving table rows

## 2.0.0-rc.12 (2020-11-30)

## (破坏性更新) Breaking changes

- The ClickOutSide component import method is changed from `import ClickOutSide from'/@/components/ClickOutSide/index.vue'` to `import {ClickOutSide} from'/@/components/ClickOutSide'`
- Button component import method changed from `import Button from'/@/components/Button/index.vue'` to `import {Button} from'/@/components/Button'`
- StrengthMeter component import method is changed from `import StrengthMeter from'/@/components/StrengthMeter'` to `import {StrengthMeter} from'/@/components/StrengthMeter'`
- In addition to the examples, the global internationalization function is added, supporting Chinese and English

### ✨ Refactor

- Refactor the overall layout. Change the code implementation method. Code is more streamlined
- Configuration item reconstruction
- Remove messageSetting configuration
- BasicTitle component `showSpan`=> `span`

### ✨ Features

- The cache can be configured to encrypt or not, and Aes encryption is enabled in the production environment by default
- Add tab drag and drop sort
- Added LayoutFooter. The default display, can be closed in the configuration

### ⚡ Performance Improvements

- Optimized the problem that the full screen animation of `Modal` component is not smooth

### 🐛 Bug Fixes

- tree: Fix the problem that the text exceeds the operation button
- useRedo: Fix the problem of missing parameters when refreshing the page through useRedo
- form: Fix the problem that the form verification is first set in the verification and the console error message
- `modal`&`drawer` fix the problem of component passing array parameters
- form: fix `updateSchema` does not take effect when the value contains `[]`
- table: Fix the display problem of the table `TableAction` icon
- table: fix table column settings not displayed by `setColumns` setting

### 🎫 Chores

- Update antdv to `2.0.0-rc.2`
- Update vue to `3.0.3`
- Update vite to `1.0.0.rc13`
- Temporarily delete `@vueuse/core`. After it is stable, it will be integrated. It is currently not stable.

## 2.0.0-rc.11 (2020-11-18)

### ✨ Features

- Added base64 file stream download
- Optimize upload components and examples
- New editable row example
- Add a personal page
- New form page
- Add details page
- Integrate upload components into form by default

### 🎫 Chores

- Update antdv to `2.0.0-rc.1` (temporarily restore to beta15, rc1 menu freezes too seriously.)
- Add some notes

### ✨ Refactor

- Removed `receiveDrawerDataRef` and `transferDrawerData` properties of `useModal` and `useDrawer`
- `openModal` and `openDrawer` corresponding to `useModal` and `useDrawer` extend the third parameter. Used to open the trigger callback again

### 🐛 Bug Fixes

- Repair form inputNumber verification error
- Fix the error of setting the default value of the form
- Fix the problem of occupying position when the menu collapse button is hidden
- Fix the form baseColProps does not take effect

## 2.0.0-rc.10 (2020-11-13)

### ✨ Refactor

- Refactor hook, introduce `@vueuse`, delete existing `hook`, optimize existing hook
- ʻUseEvent` renamed ->ʻuseEventListener`
- Delete the four types `SelectOptGroup`, `SelectOption`, `Transfer`, and `Radio` from the form `ComponentType`. Modify the `RadioButtonGroup` component

### ✨ Features

- `componentsProps` support function type of form item
- Added tag display to the menu, supporting 4 types of colors and dot display
- New menu and top bar color selection color matching
- Add sample result page
- New file download example

### ⚡ Wip

- Upload components (not completed, testing...)

### ⚡ Performance Improvements

- Optimize settingDrawer code
- Optimize the switching speed of multiple tabs
- Add form customization and dynamic capabilities

### 🐛 Bug Fixes

- Fixed multiple rich text editors showing only one
- Fixed the problem of not redirecting to the original page after logging in again after expiration
- Fix window system dynamic introduction error
- Fix page type error
- Fixed an error when the form switch and checkBox were used separately

## 2.0.0-rc.9 (2020-11-9)

### ✨ Features

- Menu trigger can select location
- Add an example of rich text embedded form
- Added `required` attribute to form component schema. Simplified configuration
- The second parameter of openModal and openDrawer can be passed internally instead of `transferModalData`
- Routes with parameters can be cached

### ✨ Refactor

- Refactored the logic of the menu generated by the background
- Route Module structural transformation

### ⚡ Performance Improvements

- Menu performance continues to be optimized and smoother
- Optimize lazy loading components and examples
- layout style fine-tuning

### 🎫 Chores

- Delete menu background image
- Update the version of ʻant-design-vue`to`beta15`
- Update `vite` version to `rc.9`
- Exception page adjustment
- `BasicTitle` Color blocks are not displayed by default

### 🐛 Bug Fixes

- Fix table type problem after upgrade
- Fix the problem that the last submenu continues to be displayed when the menu is divided and there is no data in the left menu
- Fix the issue of ʻuseMessage` type
- Fix the problem that the form item setting `disabled` does not take effect
- Fix that ʻuseECharts`can't adapt when`resize`, and an error is reported
- Fix that `resize` is not deleted after ʻuseWatermark` is cleared
- Fix form verification problem
- Fixed the problem that the multi-level header configuration does not take effect

## 2.0.0-rc.8 (2020-11-2)

### ✨ Features

- Global loading add text
- Right-click menu supports multiple levels

### 🎫 Chores

- Login cache changed from sessionStorage to LocalStorage

### ⚡ Performance Improvements

- Update ʻant-design-vue`to`beta.12`
- Layout interface layout style adjustment
- Optimize lazy loading components
- Optimize table rendering performance
- Add animation to form folding search icon
- routeModule can ignore the layout configuration. Convenient to configure the first-level menu

### 🐛 Bug Fixes

- Fix table type error
- Fix bug in mock paging tool
- Fix the folding problem of the search form when the table is opened
- Fix the problem of fixed column style when the table size is samll
- Fixed the error report when closing multiple tabs
- Fix message type error

## 2.0.0-rc.7 (2020-10-31)

### ✨ Features

- The form component now supports directly passing in the model to directly perform the set operation, please refer to **Component -> Popup Extension -> Open Popup and Pass Data**

- The useModalInner of modal now supports the incoming callback function to receive the value passed in from the external `transferModalData`

  - Used to handle the setting values ​​of components such as forms when the pop-up window is opened. Refer to **Component -> Popup Extension -> Open Popup and Pass Data**
  - The value of `receiveModalDataRef` is temporarily reserved. Use as little as possible. It may be deleted later.

- The drawer’s useDrawerInner now supports the incoming callback function to receive the value passed in from the external `transferModalData`,，
  - Used to handle the setting values ​​of components such as forms for opening the drawer Refer to **Component->Drawer Extension->Open the drawer and transfer data**
  - The value of `receiveModalDataRef` is temporarily reserved. Use as little as possible. It may be deleted later.

### ✨ Refactor

- Form code optimization and reconstruction

### ⚡ Performance Improvements

- Modal slot can be overwritten
- Optimize table embedding height calculation problem

### 🎫 Chores

- Add some notes
- pwa icon supplement
- Type adjustment
- Upgrade ʻant-design-vue`to`beta.11`, and modify the known issues brought about, and some issues will be resolved after discovery

### 🐛 Bug Fixes

- Fix the timeout error of local proxy post interface to https address
- Fix modal full screen height calculation problem when footer is not displayed
- Fix the error that the verification information is not deleted when the form is reset
- Fix the style problem of the split mode of the top menu
- Fix the invalidation of table expansion icon animation

## 2.0.0-rc.6 (2020-10-28)

### ✨ Features

- Added `pwa` function, which can be turned on in `.env.production`
- Button component extends `preIcon` and `postIcon` attributes to add icons before and after the text
- Restore the breadcrumb display icon function

### 🎫 Chores

- Upgrade vite version to `v1.0.0.rc8`
- vite.config.ts internal plugins extraction
- Build directory structure adjustment
- Dependency update
- Documentation update
- Modify the default route switching animation

### ⚡ Performance Improvements

- `setTitle` logic adjustment
- The sessionStorage and LocalStorage cache settings used by the system expire in `7` days by default

### ✨ Refactor

- Separate `vite-plugin-html` and modify the logic of inserting html

### 🐛 Bug Fixes

- Fix the warning problem of multiple registration components during hot update
- Fix the login tab page appears after login
- Fix the problem of routing switch parameter disappearance
- Fix the useMessage icon style problem

## # 2.0.0-rc.5 (2020-10-26)

### ✨ Features

- Update component documentation
- Breadcrumbs support display icon
- Added tinymce rich text component
- Add submitOnReset to the form to control whether to re-initiate the request when reset
- Added `sortFn` to the table to support custom sorting
- Added animation components and examples
- Added lazy loading/delay loading components and examples

### ✨ Refactor

- The detailType of the Drawer component is changed to isDetail

### 🎫 Chores

- Remove the optional chain syntax in the code
- Form reset logic modification
- Turn off multi-tab page tabs animation
- Upgrade vite version to `v1.0.0.rc6`
- Delete Chinese path warning. rc6 has been fixed

### 🐛 Bug Fixes

- Fix the automatic height and display footer display problems of drawer components
- Reset to default value after repairing form query
- Fix the problem of displaying the collapsed menu when there are no child nodes
- Fix the problem of breadcrumb display style
- Fixed the problem of multiple open drag and drop failure when destroyOnClose=true in modal
- Fixed multiple action columns in the table

# 2.0.0-rc.4 (2020-10-21)

### ✨ Features

- New configuration toolbar for tables
- New message notification module

### 🎫 Chores

- The table does not show borders by default
- Dependency update
- Update vue to `v3.0.2`
- Interface style fine-tuning

### ⚡ Performance Improvements

- Optimize the size of the first screen
- Optimize the TableAction component
- Reduce the folding width of the menu

### 🐛 Bug Fixes

- Fix the problem of the menu name when the first level menu is folded
- Fix the problem that the preview command is not packaged
- Fix the problem that the form actionColOptions parameter does not take effect
- Fix the problem that the loading does not take effect when refreshing the form

# 2.0.0-rc.3 (2020-10-19)

### ✨ Features

- Added excel component and excel/xml/csv/html export example
- Added excel import example
- Added global error handling
- Added markdown components and examples
- The menu name can be displayed when adding a new folding menu

### Docs

- add project doc

### 🎫 Chores

- update deps

### 🐛 Bug Fixes

- Fix the adaptive problem of the top menu
- Fix window system packaging error

# 2.0.0-rc.2 (2020-10-17)

### ✨ Features

- Package can be configured to output `gizp`
- Package can be configured to delete `console`
- Routes and menus do not need to be imported manually, they are imported automatically

### 🎫 Chores

- Upgrade vue to `3.0.1`
- Change `vite` version to daily build version

### 🐛 Bug Fixes

- Fix menu error
- Fix the problem of table adaptive height
- Fix the issue of error reporting when executing script in `window system`
- Fix the problem of folding components

### ⚡ Performance Improvements

- Remove menu to minimize background
- Prevent page refresh and re-render menu
- Some other details are optimized

# 2.0.0-rc.1 (2020-10-14)

### ✨ Features

- Add a tab with parameters

### ⚡ Performance Improvements

- Optimized menu folding
- Page details optimization
- Compress html after packaging
- Functional reconstruction of preview components and right-click menu
- The preview component operation column is centered

### 🎫 Chores

- update deps
- Added `README.en-US.md`
- Added `CHANGELOG.en-US.md`

### 🐛 Bug Fixes

- Fix page refresh and jump to landing page

# 2.0.0-beta.7 (2020-10-12)

### ⚡ Performance Improvements

- The existing tab switching no longer displays animation and progress bar

### ✨ Features

- Added `CountTo` component and sample demo
- Added `closeMessageOnSwitch` and `removeAllHttpPending` to the project configuration file
- The production environment has a separate configuration file for dynamic configuration project configuration
- Added ʻuseEcharts` and ʻuseApexChart` to facilitate the use of charts, and added related demos
- New workbench interface
- New analysis page interface

### 🎫 Chores

- Update dependencies

### 🐛 Bug Fixes

- Fix routing switch, tab inactive problem

# 2.0.0-beta.6 (2020-10-11)

### 💄 Styles

- Menu style adjustment

### 🐛 Bug Fixes

- Fix the problem that editable forms cannot be entered
- Repair packaging errors, no proxy is required in the production environment

### ⚡ Performance Improvements

- Optimize the switching speed of multi-tab pages
- First screen loading animation

# 2.0.0-beta.5 (2020-10-10)

### ♻ Code Refactoring

- Delete `tailwind css`

### ⚡ Performance Improvements

- Optimize page switching speed

### 🎫 Chores

- Add `.vscode` and `.github` configuration
- Change menu icon
- Added `.env` configuration file
- Update readme.md

### 🐛 Bug Fixes

- Fix the failure of `Tree` component check event

# 2.0.0-beta.4 (2020-10-08)

### 🎫 Chores

- Remove redundant dependencies

### 🐛 Bug Fixes

- Fix page refresh blank
- Fix the invalid table style in the production environment

# 2.0.0-beta.3 (2020-10-07)

### ✨ Features

- Added ʻopenNProgress` to the project configuration file to control whether to open the top control bar
- Add `Table` component and demo

### 🎫 Chores

- Add ` github workflows`

# 2.0.0-beta.2 (2020-10-07)

### ✨ Features

- Added image preview component

### 🔧 Continuous Integration

- Add githubAction script

# 2.0.0-beta.1(2020-09-30)

### 🎫 Chores

- Migrate some code from 1.0
- Add README.md description file

### 🐛 Bug Fixes

- Fix the problem of form, animation and packaging failure
