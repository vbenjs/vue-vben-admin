import { isDevMode } from '@/utils/env';

// 系統預設快取時間，以秒為單位
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// AES 加密金鑰
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
};

// 是否使用 AES 加密系統快取
export const SHOULD_ENABLE_STORAGE_ENCRYPTION = !isDevMode();
