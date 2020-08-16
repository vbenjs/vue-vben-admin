import { createStorage as create } from './Storage';

import { isDevMode, getEnv } from '@/utils/envUtil';

import { useSetting } from '@/hooks/core/useSetting';

const { version } = require('../../../package.json');
const { globSetting } = useSetting();

export const getStorageShortName = () => {
  return `${globSetting.shortName}__${getEnv()}${
    isDevMode() ? `__${version}` : '__' + process.env.VUE_APP_BUILD_SHORT_TIME
  }__`.toUpperCase();
};

// debug模式下不加密

const createOptions = (storage = sessionStorage) => {
  return {
    hasEncrypt: !isDevMode(),
    storage,
    prefixKey: getStorageShortName(),
  };
};
// 必须复制给变量
const WebStorage = create(createOptions());

export const createStorage = (storage: Storage = sessionStorage) => {
  return create(createOptions(storage))!;
};
export default WebStorage;
