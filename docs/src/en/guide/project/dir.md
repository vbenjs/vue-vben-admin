# Directory Explanation

The repository uses Monorepo management, and the project structure is as follows:

```bash
.
├── README.md # Project documentation
├── apps # Project applications directory
│   ├── backend-mock # Backend mock service application
│   ├── web-antd # Frontend application based on Ant Design Vue
│   ├── web-antdv-next # Frontend application based on Ant Design Vue Next
│   ├── web-ele # Frontend application based on Element Plus
│   ├── web-naive # Frontend application based on Naive UI
│   └── web-tdesign # Frontend application based on TDesign
├── cspell.json # CSpell configuration file
├── docs # Project documentation directory
├── eslint.config.mjs # ESLint configuration file
├── lefthook.yml # Git hook configuration file
├── internal # Internal tools directory
│   ├── lint-configs # Code linting configurations
│   │   ├── commitlint-config # Commitlint configuration
│   │   ├── eslint-config # ESLint configuration
│   │   ├── oxfmt-config # Oxfmt configuration
│   │   ├── oxlint-config # Oxlint configuration
│   │   └── stylelint-config # Stylelint configuration
│   ├── node-utils # Node.js tools
│   ├── tsconfig # Common tsconfig settings
│   └── vite-config # Common Vite configuration
├── oxfmt.config.ts # Oxfmt config entry
├── oxlint.config.ts # Oxlint configuration file
├── package.json # Project dependency configuration
├── packages # Project packages directory
│   ├── @core # Core package
│   │   ├── base # Base package
│   │   │   ├── design # Design related
│   │   │   ├── icons # Icons
│   │   │   ├── shared # Shared
│   │   │   └── typings # Type definitions
│   │   ├── composables # Composable APIs
│   │   ├── preferences # Preferences
│   │   └── ui-kit # UI component collection
│   │       ├── layout-ui # Layout UI
│   │       ├── menu-ui # Menu UI
│   │       ├── shadcn-ui # shadcn UI
│   │       └── tabs-ui # Tabs UI
│   ├── constants # Constants
│   ├── effects # Effects related packages
│   │   ├── access # Access control
│   │   ├── plugins # Large third-party dependency plugins
│   │   ├── common-ui # Common UI
│   │   ├── hooks # Composable APIs
│   │   ├── layouts # Layouts
│   │   └── request # Request
│   ├── icons # Icons
│   ├── locales # Internationalization
│   ├── preferences # Preferences
│   ├── stores # State management
│   ├── styles # Styles
│   ├── types # Type definitions
│   └── utils # Utilities
├── playground # Demo directory
├── pnpm-lock.yaml # pnpm lock file
├── pnpm-workspace.yaml # pnpm workspace configuration file
├── scripts # Scripts directory
│   ├── deploy # Deployment-related scripts
│   ├── turbo-run # Turbo run script
│   └── vsh # VSH script
├── stylelint.config.mjs # Stylelint configuration file
├── turbo.json # Turbo configuration file
├── vben-admin.code-workspace # VS Code workspace configuration file
└── vitest.config.ts # Vitest configuration file
```
