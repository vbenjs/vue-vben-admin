# Local Development {#development}

::: tip Code Acquisition

If you haven't acquired the code yet, you can start by reading the documentation from [Quick Start](../introduction/quick-start.md).

:::

## Prerequisites

For a better development experience, we provide some tool configurations and project descriptions to facilitate your development.

### Required Basic Knowledge

This project requires some basic frontend knowledge. Please ensure you are familiar with the basics of Vue to handle common issues. It is recommended to learn the following topics before development. Understanding these will be very helpful for the project:

- [Vue3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vitejs](https://vitejs.dev/)
- [Pnpm](https://pnpm.io/)
- [Turbo](https://turbo.build/)

### Tool Configuration

If you are using [vscode](https://code.visualstudio.com/) (recommended) as your IDE, you can install the following tools to improve development efficiency and code formatting:

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Official Vue plugin (essential).
- [Tailwind CSS](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Tailwind CSS autocomplete plugin.
- [CSS Variable Autocomplete](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables) - CSS variable autocomplete plugin.
- [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) - Iconify icon plugin.
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) - i18n plugin.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Script code linting.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatting.
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - CSS formatting.
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Spelling checker.
- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) - .env file highlighting.

## Npm Scripts

Npm scripts are common configurations used in the project to perform common tasks such as starting the project, building the project, etc. The following scripts can be found in the `package.json` file at the root of the project.

The execution command is: `pnpm run [script]` or `npm run [script]`.

```json
{
  "scripts": {
    // Build the project
    "build": "cross-env NODE_OPTIONS=--max-old-space-size=8192 turbo build",
    // Build the project with analysis
    "build:analyze": "turbo build:analyze",
    // Build a local Docker image
    "build:docker": "./build-local-docker-image.sh",
    // Build the web-antd application separately
    "build:antd": "pnpm run build --filter=@vben/web-antd",
    // Build the documentation separately
    "build:docs": "pnpm run build --filter=@vben/docs",
    // Build the web-ele application separately
    "build:ele": "pnpm run build --filter=@vben/web-ele",
    // Build the web-naive application separately
    "build:naive": "pnpm run build --filter=@vben/naive",
    // Build the playground application separately
    "build:play": "pnpm run build --filter=@vben/playground",
    // Changeset version management
    "changeset": "pnpm exec changeset",
    // Check for various issues in the project
    "check": "pnpm run check:circular && pnpm run check:dep && pnpm run check:type && pnpm check:cspell",
    // Check for circular dependencies
    "check:circular": "vsh check-circular",
    // Check spelling
    "check:cspell": "cspell lint **/*.ts **/README.md .changeset/*.md --no-progress"
    // Check dependencies
    "check:dep": "vsh check-dep",
    // Check types
    "check:type": "turbo run typecheck",
    // Clean the project (delete node_modules, dist, .turbo, etc.)
    "clean": "vsh clean",
    // Commit code
    "commit": "czg",
    // Start the project (by default, the dev scripts of all packages in the entire repository will run)
    "dev": "turbo-run dev",
    // Start the web-antd application
    "dev:antd": "pnpm -F @vben/web-antd run dev",
    // Start the documentation
    "dev:docs": "pnpm -F @vben/docs run dev",
    // Start the web-ele application
    "dev:ele": "pnpm -F @vben/web-ele run dev",
    // Start the web-naive application
    "dev:naive": "pnpm -F @vben/web-naive run dev",
    // Start the playground application
    "dev:play": "pnpm -F @vben/playground run dev",
    // Format code
    "format": "vsh lint --format",
    // Lint code
    "lint": "vsh lint",
    // After installing dependencies, execute the stub script for all packages
    "postinstall": "turbo run stub",
    // Only allow using pnpm
    "preinstall": "npx only-allow pnpm",
    // Install husky
    "prepare": "is-ci || husky",
    // Preview the application
    "preview": "turbo-run preview",
    // Package specification check
    "publint": "vsh publint",
    // Delete all node_modules, yarn.lock, package.lock.json, and reinstall dependencies
    "reinstall": "pnpm clean --del-lock && pnpm install",
    // Run vitest unit tests
    "test:unit": "vitest run --dom",
    // Update project dependencies
    "update:deps": " pnpm update --latest --recursive",
    // Changeset generation and versioning
    "version": "pnpm exec changeset version && pnpm install --no-frozen-lockfile"
  }
}
```

## Running the Project Locally

To run the documentation locally and make adjustments, you can execute the following command. This command allows you to select the application you want to develop:

```bash
pnpm dev
```

If you want to run a specific application directly, you can execute the following commands:

To run the `web-antd` application:

```bash
pnpm dev:antd
```

To run the `web-naive` application:

```bash
pnpm dev:naive
```

To run the `web-ele` application:

```bash
pnpm dev:ele
```

To run the `docs` application:

```bash
pnpm dev:docs
```

## DevTools

The project has a built-in [Vue DevTools](https://github.com/vuejs/devtools-next) plugin, which can be used during development. It is disabled by default, but can be enabled in the `.env.development` file. After enabling it, restart the project:

```bash
VITE_DEVTOOLS=true
```

Once enabled, a Vue DevTools icon will appear at the bottom of the page during project runtime. Click it to open the DevTools.

![Vue DevTools](/guide/devtools.png)

## Running Documentation Locally

To run the documentation locally and make adjustments, you can execute the following command:

```bash
pnpm dev:docs
```

## Troubleshooting

If you encounter dependency-related issues, you can try reinstalling the dependencies:

```bash
# Execute this command at the root of the project.
# This command will delete all node_modules, yarn.lock, and package.lock.json files
# and then reinstall dependencies (this process will be noticeably slower).
pnpm reinstall
```
