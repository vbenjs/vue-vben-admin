// vue-router 的 RouteMeta 模块增强只保留 @vben-core/typings/src/index.ts
// 一处（本包 src/index.ts 经 `export type * from '@vben-core/typings'` 即
// 激活）；此处曾有一份逐字重复的增强，两处 interface extends 同一基类
// 会幂等合并，删重复份不影响语义。

export interface VbenAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
  VITE_GLOB_AUTH_DINGDING_CLIENT_ID: string;
  VITE_GLOB_AUTH_DINGDING_CORP_ID: string;
}

interface AuthConfig {
  dingding?: {
    clientId: string;
    corpId: string;
  };
}

export interface ApplicationConfig {
  apiURL: string;
  auth: AuthConfig;
}

declare global {
  interface Window {
    _VBEN_ADMIN_PRO_APP_CONF_: VbenAdminProAppConfigRaw;
  }
}
