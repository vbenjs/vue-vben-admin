import type { GlobEnvConfig } from '/#/config';
import pkg from '../../package.json';
import { getVariableName } from '@vben/vite-config/src/plugins/appConfig';

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_TITLE } = getAppEnvConfig();
  return `${VITE_GLOB_APP_TITLE.replace(/\s/g, '_')}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  console.log(import.meta.env.VITE_GLOB_APP_TITLE);

  const ENV_NAME = getVariableName(import.meta.env.VITE_GLOB_APP_TITLE);
  console.log(ENV_NAME);
  const ENV = import.meta.env.DEV
    ? // Get the global configuration (the configuration will be extracted independently when packaging)
      (import.meta.env as unknown as GlobEnvConfig)
    : (window[ENV_NAME] as unknown as GlobEnvConfig);
  console.log(ENV);
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } =
    ENV;

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  };
}

/**
 * @description: Development mode
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
