/**
 * @description: 开发模式
 */
export const devMode = 'development';

/**
 * @description: 生产模式
 */
export const prodMode = 'production';

/**
 * @description: 获取环境变量
 * @param {type}
 * @returns:
 * @example:
 */
export const getEnv = (): string => process.env.NODE_ENV as string;

/**
 * @description: 是否是开发模式
 * @param {type}
 * @returns:
 * @example:
 */
export const isDevMode = (): boolean => getEnv() === devMode;

/**
 * @description: 是否是生产模式模式
 * @param {type}
 * @returns:
 * @example:
 */
export const isProdMode = (): boolean => getEnv() === prodMode;
