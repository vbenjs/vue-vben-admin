import { isDevMode, getEnv } from '/@/utils/env';
import { useSetting } from '/@/hooks/core/useSetting';

import pkg from '../../../package.json';
const { globSetting } = useSetting();

// Generate cache key according to version
export const getStorageShortName = () => {
  return `${globSetting.shortName}__${getEnv()}${
    isDevMode() ? `__${(pkg as any).version}` : '__' + process.env.VITE_BUILD_SHORT_TIME
  }__`.toUpperCase();
};
