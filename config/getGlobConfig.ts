import { GlobConfig, GlobEnvConfig } from '../src/types/config';

import { isDevMode } from '../src/utils/envUtil';
import { getShortName } from './getShortName';

export default (): GlobConfig => {
  const ENV_NAME = getShortName(process.env);
  const ENV = ((isDevMode() ? process.env : window[ENV_NAME]) as unknown) as GlobEnvConfig;
  const { GLOB_APP_TITLE, GLOB_API_URL, GLOB_APP_SHORT_NAME, GLOB_API_URL_PREFIX } = ENV;
  return {
    title: GLOB_APP_TITLE,
    apiUrl: GLOB_API_URL,
    shortName: GLOB_APP_SHORT_NAME,
    urlPrefix: GLOB_API_URL_PREFIX,
  };
};
