import { getEnv } from '/@/utils/env';
import { useGlobSetting } from '/@/hooks/setting';
import pkg from '../../../package.json';
const globSetting = useGlobSetting();

// Generate cache key according to version
export function getStorageShortName() {
  return `${globSetting.shortName}__${getEnv()}${`__${pkg.version}`}__`.toUpperCase();
}
