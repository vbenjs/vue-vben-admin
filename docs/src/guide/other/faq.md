# 常见问题 #{faq}

::: tip 列举了一些常见的问题

有问题可以先来这里寻找，如果没有可以在 [GitHub Issue](https://github.com/vbenjs/vue-vben-admin/issues) 搜索或者提交你的问题, 如果是讨论性的问题可以在 [GitHub Discussions](https://github.com/vbenjs/vue-vben-admin/discussions)

:::

## 说明

遇到问题,可以先从以下几个方面查找

1. 对应模块的 GitHub 仓库 [issue](https://github.com/vbenjs/vue-vben-admin/issues) 搜索
2. 从[google](https://www.google.com)搜索问题
3. 从[百度](https://www.baidu.com)搜索问题
4. 在下面列表找不到问题可以到 issue 提问 [issues](https://github.com/vbenjs/vue-vben-admin/issues)
5. 如果不是问题类型的，需要讨论的，请到 [discussions](https://github.com/vbenjs/vue-vben-admin/discussions) 讨论

## 依赖问题

在 `Monorepo` 项目下，需要养成每次 `git pull`代码都要执行`pnpm install`的习惯，因为经常会有新的依赖包加入，项目在`lefthook.yml`已经配置了自动执行`pnpm install`，但是有时候会出现问题，如果没有自动执行，建议手动执行一次。

## apps/web-antd 能否独立运行

**目前不支持。** 各个应用（`apps/web-antd`、`apps/web-ele`、`apps/web-naive`、`apps/web-tdesign`、`apps/web-antdv-next`）都必须保留在大仓目录内运行。

原因是这些应用并非自包含的独立项目，它们依赖大量位于 `packages/` 与 `internal/` 下的 workspace 包。以 `apps/web-antd` 为例，它的 `dependencies` 里有 20 个依赖，其中 14 个是 workspace 包：

```bash
@vben/access  @vben/common-ui  @vben/constants  @vben/hooks
@vben/icons   @vben/layouts    @vben/locales    @vben/plugins
@vben/preferences  @vben/request  @vben/stores  @vben/styles
@vben/types   @vben/utils
```

这些包没有发布到 npm，只通过 `pnpm-workspace.yaml` 在仓库内部链接。把 `apps/web-antd` 单独拷出去后，这些依赖会解析失败，应用无法启动。

此外，项目还通过 `pnpm-workspace.yaml` 的 `catalog` 字段统一管理共享依赖的版本（如 `vue`、`tailwindcss`、`vite`）。一旦脱离大仓，版本解析和构建配置都会失效。

因此，运行应用需要保留完整的大仓目录，并在**大仓根目录**执行命令：

```bash
# 启动 antd 版本
pnpm dev:antd

# 启动其他版本
pnpm dev:ele
pnpm dev:naive
pnpm dev:tdesign
pnpm dev:antdv-next
```

::: tip 关于 dev:antd

`pnpm dev:antd` 等价于 `pnpm -F @vben/web-antd run dev`，即通过 pnpm 的 filter 在根目录启动指定包。

:::

## Monorepo 下如何安装依赖

由于项目采用 Monorepo，安装依赖前必须先明确**要把依赖装到哪个包**。

### 方式一：进入指定包目录安装（推荐）

先 `cd` 进入应用目录，再执行 `pnpm add`：

```bash
# 给 apps/web-antd 安装新依赖
cd apps/web-antd
pnpm add new-lib
```

如果不先进入目录，而是在大仓根目录直接执行 `pnpm add new-lib`，pnpm 11 默认会拒绝该命令。若要将依赖添加到根 `package.json`，请执行 `pnpm add new-lib -w`；若要将依赖添加到 `apps/web-antd`，请执行 `pnpm --filter @vben/web-antd add new-lib`。

### 方式二：在根目录用 filter 指定包

```bash
# 不切换目录，直接给指定包安装
pnpm --filter @vben/web-antd add new-lib

# 安装开发依赖
pnpm --filter @vben/web-antd add -D new-lib
```

两种方式效果一致，`@vben/web-antd` 即 `apps/web-antd` 目录下的 `name` 字段。

### 大仓整体安装

```bash
# 首次克隆或更新代码后，在根目录安装全部依赖
pnpm install

# 依赖安装失败时，清理后重装
pnpm run reinstall
```

::: warning 关于 lock 文件

Monorepo 只有一个根 `pnpm-lock.yaml`，所有包的依赖都记录在其中。请不要在 `apps/*` 子目录下单独生成或提交 lock 文件。

:::

## 关于缓存更新问题

项目配置默认是缓存在 `localStorage` 内，所以版本更新后可能有些配置没改变。

解决方式是每次更新代码的时候修改 `package.json` 内的 `version` 版本号. 因为 localStorage 的 key 是根据版本号来的。所以更新后版本不同前面的配置会失效。重新登录即可

## 关于修改配置文件的问题

当修改 `.env` 等环境文件以及 `vite.config.ts` 文件时，vite 会自动重启服务。

自动重启有几率出现问题，请重新运行项目即可解决.

## 本地运行报错

由于 vite 在本地没有转换代码，且代码中用到了可选链等比较新的语法。所以本地开发需要使用版本较高的浏览器(`Chrome 90+`)进行开发

## 页面切换后页面空白

这是由于开启了路由切换动画,且对应的页面组件存在多个根节点导致的，在页面最外层添加`<div></div>`即可

**错误示例**

```vue
<template>
  <!-- 注释也算一个节点 -->
  <h1>text h1</h1>
  <h2>text h2</h2>
</template>
```

**正确示例**

```vue
<template>
  <div>
    <h1>text h1</h1>
    <h2>text h2</h2>
  </div>
</template>
```

::: tip 提示

- 如果想使用多个根标签，可以禁用路由切换动画
- template 下面的根注释节点也算一个节点

:::

## 我的代码本地开发可以，打包就不行了

目前发现这个原因可能有以下，可以从以下原因来排查，如果还有别的可能，欢迎补充

- 使用了 ctx 这个变量，ctx 本身未暴露出在实例类型内，Vue官方也是说了不要用这个属性。这个属性只是用于内部使用。

```ts
import { getCurrentInstance } from 'vue';
getCurrentInstance().ctx.xxxx;
```

## 依赖安装问题

- 如果依赖安装不了或者启动报错可以尝试执行`pnpm run reinstall`。
- 如果依赖安装不了或者报错，可以尝试切换手机热点来进行依赖安装。
- 如果还是不行，可以自行配置国内镜像安装。
- 也可以在项目根目录创建 `.npmrc` 文件，内容如下

```bash
# .npmrc
registry = https://registry.npmmirror.com/
```

## 打包文件过大

- 首先，完整版由于引用了比较多的库文件，所以打包会比较大。可以使用精简版来进行开发

- 其次建议开启 gzip，使用之后体积会只有原先 1/3 左右。gzip 可以由服务器直接开启。如果是这样，前端不需要构建 `.gz` 格式的文件，如果前端构建了 `.gz` 文件，以 nginx 为例，nginx 需要开启 `gzip_static: on` 这个选项。

- 开启 gzip 的同时还可以同时开启 `brotli`，比 gzip 更好的压缩。两者可以共存

**注意**

- gzip_static: 这个模块需要 nginx 另外安装，默认的 nginx 没有安装这个模块。

- 开启 `brotli` 也需要 nginx 另外安装模块

## 运行错误

如果出现类似以下错误，请检查项目全路径（包含所有父级路径）不能出现中文、日文、韩文。否则将会出现路径访问 404 导致以下问题

```ts
[vite] Failed to resolve module import "antdv-next/dist/antd.css-vben-adminode_modulesantdv-nextdistantd.css". (imported by /@/setup/antdv-next/index.ts)
```

## 控制台路由警告问题

如果看到控制台有如下警告，且页面**能正常打开** 可以忽略该警告。

后续 `vue-router` 可能会提供配置项来关闭警告

```ts
[Vue Router warn]: No match found for location with path "xxxx"
```

## 启动报错

当出现以下错误信息时，请检查你的 nodejs 版本号是否符合要求

```bash
TypeError: str.matchAll is not a function
at Object.extractor (vue-vben-admin-main\node_modules@purge-icons\core\dist\index.js:146:27)
at Extract (vue-vben-admin-main\node_modules@purge-icons\core\dist\index.js:173:54)
```

## nginx 部署

部署到 `nginx`后，可能会出现以下错误：

```bash
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "application/octet-stream". Strict MIME type checking is enforced for module scripts per HTML spec.
```

解决方式一：

```bash
http {
    #如果有此项配置需要注释掉
    #include       mime.types;

    types {
      application/javascript js mjs;
    }
}
```

解决方式二：

进入 `nginx` 下的`mime.types`文件, 将`application/javascript js;` 修改为 `application/javascript js mjs;`
