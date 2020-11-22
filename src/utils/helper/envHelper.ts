import { getEnv } from '/@/utils/env';
import { useGlobSetting } from '/@/settings/use';
import pkg from '../../../package.json';
const globSetting = useGlobSetting();

// Generate cache key according to version
export const getStorageShortName = () => {
  return `${globSetting.shortName}__${getEnv()}${`__${pkg.version}`}__`.toUpperCase();
};
