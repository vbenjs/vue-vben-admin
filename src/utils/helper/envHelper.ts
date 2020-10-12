import { isDevMode, getEnv } from '/@/utils/env';
import { useSetting } from '/@/hooks/core/useSetting';
import moment from 'moment';
import pkg from '../../../package.json';
const { globSetting } = useSetting();

// Generate cache key according to version
export const getStorageShortName = () => {
  const shortTime = moment().format('MMDDHHmmss');
  return `${globSetting.shortName}__${getEnv()}${
    `__${pkg.version}` + (isDevMode() ? '' : `__${shortTime}`)
  }__`.toUpperCase();
};
