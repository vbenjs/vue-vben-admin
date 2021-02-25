import { getStorageShortName } from '/@/utils/env';
import { createStorage as create } from './storageCache';
import { enableStorageEncryption } from '/@/settings/encryptionSetting';
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';

const createOptions = (storage = sessionStorage) => {
  return {
    // No encryption in debug mode
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    timeout: DEFAULT_CACHE_TIME,
  };
};

export const WebStorage = create(createOptions());

export const createStorage = (storage: Storage = sessionStorage) => {
  return create(createOptions(storage))!;
};

export default WebStorage;
