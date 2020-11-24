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

  get getOpt(): CryptoES.lib.CipherCfg {
    return {
      mode: CryptoES.mode.CBC as any,
      padding: CryptoES.pad.Pkcs7,
      iv: this.iv,
    };
  }

  encryptByAES(str: string) {
    const encrypted = CryptoES.AES.encrypt(str, this.key, this.getOpt);
    return encrypted.toString();
  }

  decryptByAES(str: string) {
    const decrypted = CryptoES.AES.decrypt(str, this.key, this.getOpt);
    return decrypted.toString(CryptoES.enc.Utf8);
  }
}
export default Encryption;
