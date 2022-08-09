/**
 * Get the configuration file variable name
 * @param env
 */
export const getConfigFileName = (name: string) => {
  return `__PRODUCTION__${name || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
};
