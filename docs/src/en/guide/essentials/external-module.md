# External Modules

In addition to the external modules that are included by default in the project, sometimes we need to import other external modules. Let's take [antdv-next](https://antdv.com/components/overview) as an example:

## Installing Dependencies

::: tip Install dependencies into a specific package

- Since the project uses [pnpm](https://pnpm.io/) as the package management tool, we need to use the `pnpm` command to install dependencies.
- As the project is managed using a Monorepo module, we need to install dependencies under a specific package. Please make sure you have entered the specific package directory before installing dependencies.

:::

```bash
# cd /path/to/your/package
pnpm add antdv-next
```

## Usage

### Global Import

```ts
import { createApp } from 'vue';
import Antd from 'antdv-next';
import App from './App';
import 'antdv-next/dist/reset.css';

const app = createApp(App);

app.use(Antd).mount('#app');
```

#### Usage

```vue
<template>
  <a-button>text</a-button>
</template>
```

### Partial Import

```vue
<script setup lang="ts">
import { Button } from 'antdv-next';
</script>

<template>
  <Button>text</Button>
</template>
```

::: warning Note

- If the component depends on styles, you also need to import the style file.

:::
