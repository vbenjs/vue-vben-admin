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
