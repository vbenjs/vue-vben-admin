import CryptoJS from 'crypto-js';
export interface EncryptionParams {
  key: string;
  iv: string;
}
export class Encryption {
  private key: string;
  private iv: string;
  constructor(opt: EncryptionParams) {
    const { key, iv } = opt;
    this.key = CryptoJS.enc.Utf8.parse(key);
    this.iv = CryptoJS.enc.Utf8.parse(iv);
  }

  // aes加密
  encryptByAES(str) {
    const encrypted = CryptoJS.AES.encrypt(str, this.key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: this.iv,
    });
    return encrypted.toString();
  }

  // aes解密
  decryptByAES(str) {
    // const WordArray = CryptoJS.enc.Hex.parse(str)
    // const base64str = CryptoJS.enc.Base64.stringify(WordArray)
    const decrypted = CryptoJS.AES.decrypt(str, this.key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: this.iv,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
export default Encryption;
