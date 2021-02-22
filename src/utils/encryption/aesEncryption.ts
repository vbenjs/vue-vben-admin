import CryptoES from 'crypto-es';

export interface EncryptionParams {
  key: string;
  iv: string;
}

export class Encryption {
  private key;

  private iv;

  constructor(opt: EncryptionParams) {
    const { key, iv } = opt;
    this.key = CryptoES.enc.Utf8.parse(key);
    this.iv = CryptoES.enc.Utf8.parse(iv);
  }

  get getOptions(): CryptoES.lib.CipherCfg {
    return {
      mode: CryptoES.mode.CBC,
      padding: CryptoES.pad.Pkcs7,
      iv: this.iv,
    };
  }

  encryptByAES(str: string) {
    return CryptoES.AES.encrypt(str, this.key, this.getOptions).toString();
  }

  decryptByAES(str: string) {
    return CryptoES.AES.decrypt(str, this.key, this.getOptions).toString(CryptoES.enc.Utf8);
  }
}
export default Encryption;
