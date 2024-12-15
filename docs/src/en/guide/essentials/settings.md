# Configuration

## Environment Variable Configuration

The project's environment variable configuration is located in the application directory under `.env`, `.env.development`, `.env.production`.

The rules are consistent with [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html). The format is as follows:

```bash
.env                # Loaded in all environments
.env.local          # Loaded in all environments, but ignored by git
.env.[mode]         # Only loaded in the specified mode
.env.[mode].local   # Only loaded in the specified mode, but ignored by git
```

::: tip

- Only variables starting with `VITE_` will be embedded into the client-side package. You can access them in the project code like this:

  ```ts
  console.log(import.meta.env.VITE_PROT);
  ```

- Variables starting with `VITE_GLOB_*` will be added to the `_app.config.js` configuration file during packaging. :::

:::

## Environment Configuration Description

::: code-group

```bash [.env]
# Application title
VITE_APP_TITLE=Vben Admin

# Application namespace, used as a prefix for caching, store, etc., to ensure isolation
VITE_APP_NAMESPACE=vben-web-antd
```

```bash [.env.development]
# Port Number
VITE_PORT=5555

# Public Path for Resources, must start and end with /
VITE_BASE=/

# API URL
VITE_GLOB_API_URL=/api

# Whether to enable Nitro Mock service, true to enable, false to disable
VITE_NITRO_MOCK=true

# Whether to open devtools, true to open, false to close
VITE_DEVTOOLS=true

# Whether to inject global loading
VITE_INJECT_APP_LOADING=true

# Whether to generate after packaging dist.zip
VITE_ARCHIVER=true
```

:::

## Dynamic Configuration in Production Environment

When executing `pnpm build` in the root directory of the monorepo, a `dist/_app.config.js` file will be automatically generated in the corresponding application and inserted into `index.html`.

`_app.config.js` is a dynamic configuration file that allows for modifications to the configuration dynamically based on different environments after the project has been built. The content is as follows:

```ts
window._VBEN_ADMIN_PRO_APP_CONF_ = {
  VITE_GLOB_API_URL: 'https://mock-napi.vben.pro/api',
};
Object.freeze(window._VBEN_ADMIN_PRO_APP_CONF_);
Object.defineProperty(window, '_VBEN_ADMIN_PRO_APP_CONF_', {
  configurable: false,
  writable: false,
});
```

### Purpose

`_app.config.js` is used for projects that need to dynamically modify configurations after packaging, such as API endpoints. There's no need to repackage; you can simply modify the variables in `/dist/_app.config.js` after packaging, and refresh to update the variables in the code. A `js` file is used to ensure that the configuration file is loaded early in the order.

### Usage

To access the variables inside `_app.config.js`, you need to use the `useAppConfig` method provided by `@vben/hooks`.

```ts
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
```

### Adding New

To add a new dynamically modifiable configuration item, simply follow the steps below:

- First, add the variable that needs to be dynamically configurable in the `.env` file or the corresponding development environment configuration file. The variable must start with `VITE_GLOB_*`, for example:

  ```bash
  VITE_GLOB_OTHER_API_URL=https://mock-napi.vben.pro/other-api
  ```

- In `packages/types/global.d.ts`, add the corresponding type definition, such as:

  ```ts
  export interface VbenAdminProAppConfigRaw {
    VITE_GLOB_API_URL: string;
    VITE_GLOB_OTHER_API_URL: string; // [!code ++]
  }

  export interface ApplicationConfig {
    apiURL: string;
    otherApiURL: string; // [!code ++]
  }
  ```

At this point, you can use the `useAppConfig` method within the project to access the newly added configuration item.

```ts
const { otherApiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
```

::: warning Warning

The `useAppConfig` method should only be used within the application and not be coupled with the internals of a package. The reason for passing `import.meta.env` and `import.meta.env.PROD` is to avoid such coupling. A pure package should avoid using variables specific to a particular build tool.

:::

## Preferences

The project offers a wide range of preference settings for dynamically configuring various features of the project:

![](/guide/preferences.png)

If you cannot find documentation for a setting, you can try configuring it yourself and then click `Copy Preferences` to override the project defaults. The configuration file is located in the application directory under `preferences.ts`, where you can override the framework's default configurations to achieve custom settings.

```ts
import { useAppConfig } from '@vben/hooks';
import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description Project configuration file
 * Only a part of the configuration in the project needs to be covered, and unnecessary configurations do not need to be covered. The default configuration will be automatically used
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
});
```

### Framework default configuration

::: details View the default configuration of the framework

```ts
const defaultPreferences: Preferences = {
  app: {
    accessMode: 'frontend',
    authPageLayout: 'panel-right',
    checkUpdatesInterval: 1,
    colorGrayMode: false,
    colorWeakMode: false,
    compact: false,
    contentCompact: 'wide',
    defaultAvatar:
      'https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp',
    dynamicTitle: true,
    enableCheckUpdates: true,
    enablePreferences: true,
    enableRefreshToken: false,
    isMobile: false,
    layout: 'sidebar-nav',
    locale: 'zh-CN',
    loginExpiredMode: 'modal',
    name: 'Vben Admin',
    preferencesButtonPosition: 'auto',
    watermark: false,
  },
  breadcrumb: {
    enable: true,
    hideOnlyOne: false,
    showHome: false,
    showIcon: true,
    styleType: 'normal',
  },
  copyright: {
    companyName: 'Vben',
    companySiteLink: 'https://www.vben.pro',
    date: '2024',
    enable: true,
    icp: '',
    icpLink: '',
  },
  footer: {
    enable: true,
    fixed: false,
  },
  header: {
    enable: true,
    hidden: false,
    mode: 'fixed',
  },
  logo: {
    enable: true,
    source: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
  },
  navigation: {
    accordion: true,
    split: true,
    styleType: 'rounded',
  },
  shortcutKeys: {
    enable: true,
    globalLockScreen: true,
    globalLogout: true,
    globalPreferences: true,
    globalSearch: true,
  },
  sidebar: {
    autoActivateChild: false,
    collapsed: false,
    collapsedShowTitle: false,
    enable: true,
    expandOnHover: true,
    extraCollapse: true,
    hidden: false,
    width: 230,
  },
  tabbar: {
    draggable: true,
    enable: true,
    height: 36,
    keepAlive: true,
    persist: true,
    showIcon: true,
    showMaximize: true,
    showMore: true,
    styleType: 'chrome',
  },
  theme: {
    builtinType: 'default',
    colorDestructive: 'hsl(348 100% 61%)',
    colorPrimary: 'hsl(212 100% 45%)',
    colorSuccess: 'hsl(144 57% 58%)',
    colorWarning: 'hsl(42 84% 61%)',
    mode: 'dark',
    radius: '0.5',
    semiDarkHeader: false,
    semiDarkSidebar: true,
  },
  transition: {
    enable: true,
    loading: true,
    name: 'fade-slide',
    progress: true,
  },
  widget: {
    fullscreen: true,
    globalSearch: true,
    languageToggle: true,
    lockScreen: true,
    notification: true,
    sidebarToggle: true,
    themeToggle: true,
    refresh: true,
  },
};
```

:::

::: details View the default configuration type of the framework

```ts
interface AppPreferences {
  /** Permission mode */
  accessMode: AccessModeType;
  /** Layout of the login/registration page */
  authPageLayout: AuthPageLayoutType;
  /** Interval for checking updates */
  checkUpdatesInterval: number;
  /** Whether to enable gray mode */
  colorGrayMode: boolean;
  /** Whether to enable color weakness mode */
  colorWeakMode: boolean;
  /** Whether to enable compact mode */
  compact: boolean;
  /** Whether to enable content compact mode */
  contentCompact: ContentCompactType;
  // /** Default application avatar */
  defaultAvatar: string;
  // /** Enable dynamic title */
  dynamicTitle: boolean;
  /** Whether to enable update checks */
  enableCheckUpdates: boolean;
  /** Whether to display preferences */
  enablePreferences: boolean;
  /**
   * @zh_CN Whether to enable refreshToken
   */
  enableRefreshToken: boolean;
  /** Whether it's mobile */
  isMobile: boolean;
  /** Layout method */
  layout: LayoutType;
  /** Supported languages */
  locale: SupportedLanguagesType;
  /** Login expiration mode */
  loginExpiredMode: LoginExpiredModeType;
  /** Application name */
  name: string;
  /** Position of the preferences button */
  preferencesButtonPosition: PreferencesButtonPositionType;
  /**
   * @zh_CN Whether to enable watermark
   */
  watermark: boolean;
}
interface BreadcrumbPreferences {
  /** Whether breadcrumbs are enabled */
  enable: boolean;
  /** Whether to hide breadcrumbs when there is only one */
  hideOnlyOne: boolean;
  /** Whether the home icon in breadcrumbs is visible */
  showHome: boolean;
  /** Whether the icon in breadcrumbs is visible */
  showIcon: boolean;
  /** Breadcrumb style */
  styleType: BreadcrumbStyleType;
}

interface CopyrightPreferences {
  /** Copyright company name */
  companyName: string;
  /** Link to the copyright company's site */
  companySiteLink: string;
  /** Copyright date */
  date: string;
  /** Whether copyright is visible */
  enable: boolean;
  /** ICP number */
  icp: string;
  /** Link to the ICP */
  icpLink: string;
}

interface FooterPreferences {
  /** Whether the footer is visible */
  enable: boolean;
  /** Whether the footer is fixed */
  fixed: boolean;
}

interface HeaderPreferences {
  /** Whether the header is enabled */
  enable: boolean;
  /** Whether the header is hidden, css-hidden */
  hidden: boolean;
  /** Header display mode */
  mode: LayoutHeaderModeType;
}

interface LogoPreferences {
  /** Whether the logo is visible */
  enable: boolean;
  /** Logo URL */
  source: string;
}

interface NavigationPreferences {
  /** Navigation menu accordion mode */
  accordion: boolean;
  /** Whether the navigation menu is split, only effective in layout=mixed-nav */
  split: boolean;
  /** Navigation menu style */
  styleType: NavigationStyleType;
}
interface SidebarPreferences {
  /** Whether the sidebar is collapsed */
  collapsed: boolean;
  /** Whether to show title when sidebar is collapsed */
  collapsedShowTitle: boolean;
  /** Whether the sidebar is visible */
  enable: boolean;
  /** Menu auto-expand state */
  expandOnHover: boolean;
  /** Whether the sidebar extension area is collapsed */
  extraCollapse: boolean;
  /** Whether the sidebar is hidden - css */
  hidden: boolean;
  /** Sidebar width */
  width: number;
}

interface ShortcutKeyPreferences {
  /** Whether shortcut keys are enabled globally */
  enable: boolean;
  /** Whether the global lock screen shortcut is enabled */
  globalLockScreen: boolean;
  /** Whether the global logout shortcut is enabled */
  globalLogout: boolean;
  /** Whether the global preferences shortcut is enabled */
  globalPreferences: boolean;
  /** Whether the global search shortcut is enabled */
  globalSearch: boolean;
}

interface TabbarPreferences {
  /** Whether dragging of multiple tabs is enabled */
  draggable: boolean;
  /** Whether multiple tabs are enabled */
  enable: boolean;
  /** Tab height */
  height: number;
  /** Whether tab caching is enabled */
  keepAlive: boolean;
  /** Whether tabs are persistent */
  persist: boolean;
  /** Whether icons in multiple tabs are enabled */
  showIcon: boolean;
  /** Whether to show the maximize button */
  showMaximize: boolean;
  /** Whether to show the more button */
  showMore: boolean;
  /** Tab style */
  styleType: TabsStyleType;
}
interface ThemePreferences {
  /** Built-in theme name */
  builtinType: BuiltinThemeType;
  /** Destructive color */
  colorDestructive: string;
  /** Primary color */
  colorPrimary: string;
  /** Success color */
  colorSuccess: string;
  /** Warning color */
  colorWarning: string;
  /** Current theme */
  mode: ThemeModeType;
  /** Radius */
  radius: string;
  /** Whether to enable semi-dark header (only effective when theme='light') */
  semiDarkHeader: boolean;
  /** Whether to enable semi-dark sidebar (only effective when theme='light') */
  semiDarkSidebar: boolean;
}

interface TransitionPreferences {
  /** Whether page transition animations are enabled */
  enable: boolean;
  // /** Whether page loading loading is enabled */
  loading: boolean;
  /** Page transition animation */
  name: PageTransitionType | string;
  /** Whether page loading progress animation is enabled */
  progress: boolean;
}

interface WidgetPreferences {
  /** Whether fullscreen widgets are enabled */
  fullscreen: boolean;
  /** Whether global search widget is enabled */
  globalSearch: boolean;
  /** Whether language switch widget is enabled */
  languageToggle: boolean;
  /** Whether lock screen functionality is enabled */
  lockScreen: boolean;
  /** Whether notification widget is displayed */
  notification: boolean;
  /** Whether to show the refresh button */
  refresh: boolean;
  /** Whether sidebar show/hide widget is displayed */
  sidebarToggle: boolean;
  /** Whether theme switch widget is displayed */
  themeToggle: boolean;
}
interface Preferences {
  /** Global configuration */
  app: AppPreferences;
  /** Header configuration */
  breadcrumb: BreadcrumbPreferences;
  /** Copyright configuration */
  copyright: CopyrightPreferences;
  /** Footer configuration */
  footer: FooterPreferences;
  /** Breadcrumb configuration */
  header: HeaderPreferences;
  /** Logo configuration */
  logo: LogoPreferences;
  /** Navigation configuration */
  navigation: NavigationPreferences;
  /** Shortcut key configuration */
  shortcutKeys: ShortcutKeyPreferences;
  /** Sidebar configuration */
  sidebar: SidebarPreferences;
  /** Tab bar configuration */
  tabbar: TabbarPreferences;
  /** Theme configuration */
  theme: ThemePreferences;
  /** Animation configuration */
  transition: TransitionPreferences;
  /** Widget configuration */
  widget: WidgetPreferences;
}
```

:::

::: warning Warning

- The `overridesPreferences` method only needs to override a part of the configurations in the project. There's no need to override configurations that are not needed; they will automatically use the default settings.
- Any configuration item can be overridden. You just need to override it within the `overridesPreferences` method. Do not modify the default configuration file.

:::
