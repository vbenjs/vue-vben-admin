export const getShortName = (env) => {
  return `__PRODUCTION__${env.GLOB_APP_SHORT_NAME || '__APP'}__CONF__`.toUpperCase();
};
