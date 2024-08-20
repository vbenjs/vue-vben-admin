# 精简版本

从 `5.0` 版本开始，我们不再提供精简的仓库或者分支。我们的目标是提供一个更加一致的开发体验，同时减少维护成本。在这里，我们将如何介绍自己的项目，如何去精简以及移除不需要的功能。

## 应用精简

首先，确认你需要的 `UI` 组件库版本，然后删除对应的应用，比如你选择使用 `Ant Design Vue`，那么你可以删除其他应用， 只需要删除下面两个文件夹即可：

```bash
apps/web-ele
apps/web-native

```

::: tip

如果项目没有内置你需要的 `UI` 组件库应用，你可以直接全部删除其他应用。然后自行新建应用即可。

:::

## 演示代码精简

如果你不需要演示代码，你可以直接删除的`playground`文件夹。

## 文档精简

如果你不需要文档，你可以直接删除`docs`文件夹。

## Mock 服务精简

如果你不需要`Mock`服务，你可以直接删除`apps/backend-mock`文件夹。同时在你的应用下`.env.development`文件中删除`VITE_NITRO_MOCK`变量。

```bash
# 是否开启 Nitro Mock服务，true 为开启，false 为关闭
VITE_NITRO_MOCK=false
```

## 安装依赖

到这里，你已经完成了精简操作，接下来你可以安装依赖，并启动你的项目：

```bash
# 根目录下执行
pnpm install

```

## 命令调整

在精简后，你可能需要根据你的项目调整命令，在根目录下的`package.json`文件中，你可以调整`scripts`字段，移除你不需要的命令。

```json
{
  "scripts": {
    "build:antd": "pnpm run build --filter=@vben/web-antd",
    "build:docs": "pnpm run build --filter=@vben/docs",
    "build:ele": "pnpm run build --filter=@vben/web-ele",
    "build:naive": "pnpm run build --filter=@vben/web-naive",
    "build:play": "pnpm run build --filter=@vben/playground",
    "dev:antd": "pnpm -F @vben/web-antd run dev",
    "dev:docs": "pnpm -F @vben/docs run dev",
    "dev:ele": "pnpm -F @vben/web-ele run dev",
    "dev:play": "pnpm -F @vben/playground run dev",
    "dev:naive": "pnpm -F @vben/web-naive run dev"
  }
}
```
