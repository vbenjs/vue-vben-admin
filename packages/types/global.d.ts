// vue-router 的 RouteMeta 增强唯一来源是 @vben-core/typings/src/index.ts，
// 此处不再重复声明；侧效果导入保证仅经由 `@vben/types/global` 子路径消费
// 本包的程序（不经过 src/index.ts barrel）同样激活该增强。
import '@vben-core/typings';

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
