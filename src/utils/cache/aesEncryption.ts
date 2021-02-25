import type { lib } from 'crypto-js';

import { encrypt, decrypt } from 'crypto-js/aes';
import Uft8, { parse } from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';

export interface EncryptionParams {
  key: string;
  iv: string;
}

export class Encryption {
  private key: lib.WordArray;
  private iv: lib.WordArray;

  constructor(opt: EncryptionParams) {
    const { key, iv } = opt;
    this.key = parse(key);
    this.iv = parse(iv);
  }

  get getOptions() {
    return {
      // mode: mode.CBC,
      padding: pkcs7,
      iv: this.iv,
    };
  }

  encryptByAES(str: string) {
    return encrypt(str, this.key, this.getOptions).toString();
  }

  decryptByAES(str: string) {
    return decrypt(str, this.key, this.getOptions).toString(Uft8);
  }
}
export default Encryption;
