import type { GlobEnvConfig } from '/#/config';

import { useGlobSetting } from '/@/hooks/setting';
import pkg from '../../package.json';

/**
 * Get the global configuration (the configuration will be extracted independently when packaging)
 */
export function getGlobEnvConfig(): GlobEnvConfig {
  const env = import.meta.env;
  return (env as unknown) as GlobEnvConfig;
}

// Generate cache key according to version
export function getStorageShortName() {
  const globSetting = useGlobSetting();
  return `${globSetting.shortName}__${getEnv()}${`__${pkg.version}`}__`.toUpperCase();
}

/**
 * @description: Development model
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}

/**
 * @description: Whether to open mock
 * @returns:
 * @example:
 */
export function isUseMock(): boolean {
  return import.meta.env.VITE_USE_MOCK === 'true';
}
