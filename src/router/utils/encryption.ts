import { cacheCipher } from '@/settings/encryptionSetting';
import { Encryption, EncryptionFactory } from '@/utils/cipher';

const base64Encryption = EncryptionFactory.createBase64Encryption();
const persistEncryption: Encryption = EncryptionFactory.createAesEncryption({
  key: cacheCipher.key,
  iv: cacheCipher.iv,
});

export const getEncryptToBase64 = (key: any) => {
  const encryptStr = persistEncryption.encrypt(key);
  return base64Encryption.encrypt(encryptStr);
};

/**
 * 解密
 * @param data
 * @returns {string}
 */
export const getDecryptByBase64 = (data) => {
  const decryptStr = base64Encryption.decrypt(data);
  return persistEncryption.decrypt(decryptStr);
};
