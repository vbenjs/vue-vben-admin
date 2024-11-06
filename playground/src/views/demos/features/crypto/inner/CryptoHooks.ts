import { CryptoJS } from '@vben/utils';

export function hashingFn1(inputMessage: string, type: string) {
  const algorithms = type;

  let hashingOutput;
  switch (algorithms) {
    case 'MD5': {
      hashingOutput = CryptoJS.MD5(inputMessage);
      break;
    }
    case 'RIPEMD160': {
      hashingOutput = CryptoJS.RIPEMD160(inputMessage);
      break;
    }
    case 'SHA1': {
      hashingOutput = CryptoJS.SHA1(inputMessage);
      break;
    }
    case 'SHA224': {
      hashingOutput = CryptoJS.SHA224(inputMessage);
      break;
    }
    case 'SHA256': {
      hashingOutput = CryptoJS.SHA256(inputMessage);
      break;
    }
    case 'SHA384': {
      hashingOutput = CryptoJS.SHA384(inputMessage);
      break;
    }
    case 'SHA512': {
      hashingOutput = CryptoJS.SHA512(inputMessage);
      break;
    }
    case 'SHA3224': {
      hashingOutput = CryptoJS.SHA3(inputMessage, { outputLength: 224 });
      break;
    }
    case 'SHA3256': {
      hashingOutput = CryptoJS.SHA3(inputMessage, { outputLength: 256 });
      break;
    }
    case 'SHA3384': {
      hashingOutput = CryptoJS.SHA3(inputMessage, { outputLength: 384 });
      break;
    }
    case 'SHA3512': {
      hashingOutput = CryptoJS.SHA3(inputMessage, { outputLength: 512 });
      break;
    }
    default: {
      hashingOutput = '';
    }
  }
  return hashingOutput.toString();
}

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
