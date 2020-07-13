import { createStorage as create } from './Storage';

import { isDevMode, getEnv } from '@/utils/envUtil';

import { useSetting } from '@/hooks/core/useSetting';
const { globSetting } = useSetting();

const shortNameName = `${globSetting.shortName}__${getEnv()}__`.toUpperCase();

// debug模式下不加密

const createOptions = (storage = sessionStorage) => {
  return {
    hasEncrypt: !isDevMode(),
    storage,
    prefixKey: shortNameName,
  };
};
// 必须复制给变量
const WebStorage = create(createOptions());

export const createStorage = (storage: Storage = sessionStorage) => {
  return create(createOptions(storage))!;
};
export default WebStorage;
