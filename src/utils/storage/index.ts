// import Storage from '@ylz/plugins/lib/storage';
import { createStorage as create } from './Storage';

import { isDevMode } from '@/utils/envUtil';
// debug模式下不加密

const createOptions = (storage = sessionStorage) => {
  return {
    hasEncrypt: !isDevMode(),
    storage,
  };
};
// 必须复制给变量
const WebStorage = create(createOptions());

export const createStorage = (storage: Storage = sessionStorage) => {
  return create(createOptions(storage))!;
};
export default WebStorage;
