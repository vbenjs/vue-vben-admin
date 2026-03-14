# Standards

::: tip Contributing Code

- If you want to contribute code to the project, please ensure your code complies with the project's coding standards.
- If you are using `vscode`, you need to install the following plugins:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Script code checking
  - [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) - Oxlint / Oxfmt integration
  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Word syntax checking
  - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - CSS formatting

:::

## Purpose

Students with basic engineering literacy always pay attention to coding standards, and code style checking (Code Linting, simply called Lint) is an important means to ensure the consistency of coding standards.

Following the corresponding coding standards has the following benefits:

- Lower bug error rate
- Efficient development efficiency
- Higher readability

## Tools

The project's configuration files are located in `internal/lint-configs`, where you can modify various lint configurations.

The project integrates the following code verification tools:

- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) for code formatting
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) for JavaScript / TypeScript linting
- [ESLint](https://eslint.org/) for Vue, JSONC, YAML, and related rules
- [Stylelint](https://stylelint.io/) for CSS style checking
- [Commitlint](https://commitlint.js.org/) for checking the standard of git commit messages
- [Publint](https://publint.dev/) for checking the standard of npm packages
- [Cspell](https://cspell.org/) for checking spelling errors
- [lefthook](https://github.com/evilmartians/lefthook) for managing Git hooks, automatically running code checks and formatting before commits

## Oxfmt

Oxfmt is used to keep code formatting consistent across the repository.

### Command

```bash
pnpm oxfmt
pnpm oxfmt --check
```

### Configuration

The root Oxfmt entry file is `oxfmt.config.ts`, and its core configuration is located in `internal/lint-configs/oxfmt-config`.

## Oxlint

Oxlint is the primary script linting tool for the repository.

### Command

```bash
pnpm oxlint
pnpm oxlint --fix
```

### Configuration

The core Oxlint configuration is located in `internal/lint-configs/oxlint-config`, and the root entry file is `oxlint.config.ts`.

## ESLint

ESLint is used to complement Vue, JSONC, YAML, and related rules.

### Command

```bash
pnpm eslint . --cache
```

### Configuration

The ESLint configuration file is `eslint.config.mjs`, with its core configuration located in the `internal/lint-configs/eslint-config` directory, which can be modified according to project needs.

## Stylelint

Stylelint is used to check the style of CSS within the project. Coupled with the editor's auto-fix feature, it can effectively unify the CSS style within the project.

### Command

```bash
pnpm stylelint "**/*.{vue,css,less,scss}" --cache
```

### Configuration

The Stylelint configuration file is `stylelint.config.mjs`, with its core configuration located in the `internal/lint-configs/stylelint-config` directory, which can be modified according to project needs.

## CommitLint

In a team, everyone's git commit messages can vary widely, making it difficult to ensure standardization without a mechanism. You might think of using git's hook mechanism to write shell scripts to implement this. Of course, this is possible, but JavaScript has a good tool for this template: commitlint.

### Configuration

The CommitLint configuration file is `.commitlintrc.js`, with its core configuration located in the `internal/lint-configs/commitlint-config` directory, which can be modified according to project needs.

### Git Commit Standards

Refer to [Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)

- `feat` Add new features
- `fix` Fix problems / BUGs
- `style` Code style changes that do not affect the outcome
- `perf` Optimization / performance improvement
- `refactor` Refactoring
- `revert` Revert changes
- `test` Related to tests
- `docs` Documentation / comments
- `chore` Dependency updates / scaffold configuration changes
- `workflow` Workflow improvements
- `ci` Continuous integration
- `types` Type modifications

### Disabling Git Commit Standard Checks

If you want to disable Git commit standard checks, there are two ways:

::: code-group

```bash [Temporary disable]
git commit -m 'feat: add home page' --no-verify
```

```yaml [Long-term disable]
commit-msg:
  commands:
    # commitlint:
    #   run: pnpm exec commitlint --edit $1
```

:::

If you changed `lefthook.yml`, reinstall hooks with:

```bash
pnpm exec lefthook install
```

## Publint

Publint is a tool for checking npm package standards, including package versioning, exports, and ESM package structure.

### Command

```bash
pnpm publint
```

## Cspell

Cspell is a tool for checking spelling errors in the code, avoiding bugs caused by spelling mistakes.

### Command

```bash
pnpm check:cspell
```

### Configuration

The cspell configuration file is `cspell.json`, which can be modified according to project needs.

## Git Hook

Git hooks are generally combined with various lints to check code style during git commits. If the check fails, the commit will not proceed. Developers need to modify and resubmit.

### lefthook

One issue is that the check would verify all code, but in practice we usually only want to check the code being committed. This is where lefthook comes in.

The most effective solution is to perform lint checks locally before committing. A common practice is to use lefthook to perform checks before local submission.

The project defines corresponding hooks inside `lefthook.yml`:

- `pre-commit`: Runs before commit, used for code formatting and checking
  - `code-workspace`: Updates VSCode workspace configuration
  - `lint-md`: Formats Markdown files
  - `lint-vue`: Formats and checks Vue files
  - `lint-js`: Formats and checks JavaScript / TypeScript files
  - `lint-style`: Formats and checks style files
  - `lint-package`: Formats `package.json`
  - `lint-json`: Formats other JSON files
- `post-merge`: Runs after merge, used for automatic dependency installation
  - `install`: Runs `pnpm install` to install new dependencies
- `commit-msg`: Runs during commit, used for checking commit message format
  - `commitlint`: Uses commitlint to check commit messages

Current hooks can be installed with:

```bash
pnpm exec lefthook install
```

#### How to Disable lefthook

If you want to temporarily disable lefthook, use:

```bash
git commit -m 'feat: add home page' --no-verify
```

#### How to Modify lefthook Configuration

If you want to modify lefthook's configuration, you can edit the `lefthook.yml` file. For example:

```yaml
pre-commit:
  parallel: true
  commands:
    lint-js:
      run: pnpm oxfmt {staged_files} && pnpm oxlint --fix {staged_files} && pnpm eslint --cache --fix {staged_files}
      glob: '*.{js,jsx,ts,tsx}'
```

Where:

- `parallel`: Whether to execute tasks in parallel
- `commands`: Defines the list of tasks to execute
- `run`: Command to execute
- `glob`: File pattern to match
- `{staged_files}`: Represents the list of staged files
