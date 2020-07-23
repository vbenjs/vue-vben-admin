<p align="center">
  <a href="https://github.com/anncwb/vue-vben-admin" target="_blank">
    <img alt="VbenAdmin Logo" width="200" src="./docs/images/logo.png">
  </a>
</p>
<h2 align="center">VUE VBEN ADMIN</h2>

[中文](https://github.com/anncwb/vue-vben-admin/README-CN.md) | **English**

A basic framework suitable for the development of medium and large projects requires a certain understanding of `vue`, `typescript`, and can also be used as an example of understanding the new wording, and adapt to the development method of subsequent new versions in advance

The project is based on the vue3 style background management system implemented by `ant-design-vue`, `typescript`, `vue-composition-api`, `TSX`

Compatible with vue2 browsers, everything is free and does not charge any fees, please rest assured to use. Subsequent regular updates and maintenance are provided for reference and learning

### Preview

[Live Demo](https://vvbin.cn/)

### gitHub

[vue-vben-admin](https://github.com/anncwb/vue-vben-admin)

### Document

Due to the relatively short writing time, the document is still under development for the time being, and will be added one after another...

### Why write this

At present, there is no relevant background system written using `composition-api` and `typescript` on the Internet, so I will share what I wrote. New features will be added in the future, and when `vue3` is completely stable, A version of `vue3` will be provided. The cost of switching to `vue3` after this project is relatively low, and the subsequent one-click version switching will be made

### Why use composition-api

The biggest reason is that we still need to be compatible with `ie11`, `ie9` and `ie10`. We may need to modify the compatibility of css and some plug-ins by ourselves. When `vue3` is stable, it will support `ie11` at most, so we will use it temporarily `vue-composition-api` for development

## Technology used

- vue2.6.11(Vue3 version will be provided later)
- composition-api
- vuex@3.4.0
- vuex-module-decorators
- vue-router@3.3.4
- axios@0.19.2
- ant-design-vue@1.6.3
- mockjs
- vue-i18n
- moment
- lodash

[CHANGELOG](CHANGELOG.md)

- [Technology used](#technology-used)
- [Environmental requirements](#environmental-requirements)
  - [Suggested development environment](#suggested-development-environment)
- [Browser support](#browser-support)
- [install](#install)
- [Terminal](#terminal)
  - [Start the development environment](#start-the-development-environment)
  - [Build](#build)
  - [unit test](#unit-test)
  - [format](#format)
  - [Other](#other)
- [Git Submit specifications](#git-submit-specifications)
- [CodeContribution](#codecontribution)
- [DevelopmentPlan](#developmentplan)
- [joinUs](#joinus)
-

## Environmental requirements

- `Node.js`: >= v10
- `yarn`: latest

### Suggested development environment

- `Git`: Code management
- `Visual Studio Code` (VSCode): IDE

VSCode Plugin

- `Vetur`: vue Development essential
- `GitLens`: Git visualization tool
- `ESLint`: Script code inspection
- `stylelint`: Style code check
- `Prettier - Code formatter`:Code formatting

## Browser support

Support modern browsers and IE10+

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## install

```js
git config core.ignorecase false # Make git case sensitive to file names

// Pull project code
git clone https://github.com/anncwb/vue-vben-admin.git

cd vue-vben-admin

//  It is best to use yarn/npm, otherwise hot update may cause problems
yarn install

```

## Terminal

### Start the development environment

```bash
yarn serve
```

### Build

At the same time, the file name `window-glob.js` configuration file will be generated, and the project configuration can dynamically modify the file and update the code variables in real time, such as the interface address

```bash

yarn build # Packaging will use hardSource for packaging

yarn build:no-cache # Packaging will not use hardSource for packaging

yarn report # Generate build package table preview
```

### unit test

```bash
yarn test:unit # --watch : Track file changes
```

### format

```bash
yarn lint:stylelint # Style formatting

yarn lint:prettier # js/ts code formatting
```

### Other

```bash
yarn reinstall # Remove dependencies and reinstall, compatible with window

yarn preview # Package preview locally

yarn log # Generate CHANGELOG
```

## Git Submit specifications

- reference [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) specification ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` Add new features
  - `fix` Fix the problem/BUG
  - `style` The code style does not affect the running result
  - `perf` Optimization/performance improvement
  - `refactor` Refactor
  - `revert` Undo edit
  - `test` Test related
  - `docs` Documentation/notes
  - `chore` Dependent update/scaffolding configuration modification etc.
  - `workflow` Workflow improvements
  - `ci` Continuous integration
  - `mod` Uncertain classification modification
  - `wip` Delete Files

## CodeContribution

1. Fork code!
2. Create your own branch: `git checkout -b feat/xxxx`
3. Submit your changes: `git commit -am 'feat(function): add xxxxx'`
4. Push your branch: `git push origin feat/xxxx`
5. submit `pull request`

## DevelopmentPlan

Due to the short development time, the functions are temporarily less

The follow-up will be gradually improved, and what components are needed can be proposed

- [x] Project construction (based on vue-cli4) has been optimized
- [x] First screen loading waiting animation
- [x] Login and logout
- [x] Menu (can search and drag and drop and menu layout)
- [x] Multiple tabs/breadcrumbs
- [x] Role-based permission management
- [x] Authority management based on background
- [x] Separate routing and menu settings
- [x] Collapsible sidebar
- [x] Draggable sidebar
- [x] Multi-tab mode/global control
- [x] Support menu svg icon
- [x] Menu search
- [x] Page loading/page timeout component
- [x] Scroll bar component
- [x] Lazy loading components
- [x] Pop-up window expansion (dragable, full screen, adaptive height)
- [x] Full screen
- [x] Auto-register SVG icon
- [x] Mock data
- [x] Clipboard package
- [x] hooks package
- [x] Chart library
- [x] Digital animation
- [x] Project configurable
- [x] Theme configuration
- [x] Form component
- [x] Right-click menu
- [x] Watermark plugin
- [x] Parallax component
- [x] Animation component
- [x] QR code plugin
- [x] Internationalization plugin
- [x] Picture preview component
- [x] Details component
- [x] Table component
- [x] Image crop
- [x] Rich text component
- [x] Upload components
- [ ] Tree component
- [ ] Editable table
- [ ] Data import and export
- [ ] Verification code/Verification component
- [ ] Drag panel
- [ ] Dark theme
- [ ] System is further optimized
- [ ] Compatible with the latest `vuex`, `vue-router`
- [ ] Build `vite` version
- [ ] More components/functions/suggestions/bugs/welcome to submit pr or issue

## joinUs

`VUE-VBEN-ADMIN` is a completely open source and free project. It aims to help developers more easily develop medium and large management systems. It also provides QQ exchange groups (because the project has just started a few days ago, there are not many people in the group, so interested You can join the group to discuss together), use questions welcome to ask questions in the group.

- QQ group `569291866`

 <img alt="VbenAdmin Logo" width="100" src="./docs/images/qq.jpeg">
