import { getStorageShortName } from '/@/utils/helper/envHelper';
import { createStorage as create } from './storageCache';
import { enableStorageEncryption } from '/@/settings/encryptionSetting';

const createOptions = (storage = sessionStorage) => {
  return {
    // No encryption in debug mode
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
  };
};

export const WebStorage = create(createOptions());

export const createStorage = (storage: Storage = sessionStorage) => {
  return create(createOptions(storage))!;
};

export default WebStorage;
