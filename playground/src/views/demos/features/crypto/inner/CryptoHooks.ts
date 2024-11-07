import { CryptoJS } from '@vben/utils';

type HashAlgorithm =
  | 'MD5'
  | 'RIPEMD160'
  | 'SHA1'
  | 'SHA224'
  | 'SHA256'
  | 'SHA384'
  | 'SHA512'
  | 'SHA3224'
  | 'SHA3256'
  | 'SHA3384'
  | 'SHA3512';

export function hashingFn(inputMessage: string, type: HashAlgorithm): string {
  if (!inputMessage) {
    throw new Error('Input message cannot be empty');
  }

  const sha3Variants = {
    SHA3224: 224,
    SHA3256: 256,
    SHA3384: 384,
    SHA3512: 512,
  };

  if (type.startsWith('SHA3')) {
    return CryptoJS.SHA3(inputMessage, {
      outputLength: sha3Variants[type as keyof typeof sha3Variants],
    }).toString();
  }

  const hashFunction = CryptoJS[type];
  if (!hashFunction) {
    throw new Error(`Unsupported hash algorithm: ${type}`);
  }

  return hashFunction(inputMessage).toString();
}

export function aesEncryptFn(inputMessage: string, secret: string) {
  const encrypted = CryptoJS.AES.encrypt(inputMessage, secret).toString();
  return encrypted;
}
export function aesDecryptFn(inputMessage: string, secret: string) {
  const decrypted = CryptoJS.AES.decrypt(inputMessage, secret).toString(
    CryptoJS.enc.Utf8,
  );
  return decrypted;
}
export function desEncryptFn(inputMessage: string, secret: string) {
  const encrypted = CryptoJS.DES.encrypt(inputMessage, secret).toString();
  return encrypted;
}
export function desDecryptFn(inputMessage: string, secret: string) {
  const decrypted = CryptoJS.DES.decrypt(inputMessage, secret).toString(
    CryptoJS.enc.Utf8,
  );
  return decrypted;
}
