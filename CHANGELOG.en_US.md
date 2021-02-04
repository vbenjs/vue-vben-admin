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
