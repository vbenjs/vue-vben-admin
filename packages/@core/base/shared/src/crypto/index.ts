import CryptoJS from 'crypto-js';

export { CryptoJS };
const MIN_SECRET_LENGTH = 32;
export class Crypto<T extends object> {
  /** Secret */
  private readonly secret: string;
  constructor(secret: string) {
    if (typeof secret === 'string' && secret.length < MIN_SECRET_LENGTH) {
      throw new Error(
        `Secret must be at least ${MIN_SECRET_LENGTH} characters long`,
      );
    }
    this.secret = secret;
  }

  decrypt(encrypted: string) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secret);
    const dataString = decrypted.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(dataString) as T;
    } catch {
      // avoid parse error
      return null;
    }
  }

  encrypt(data: T): string {
    const dataString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(dataString, this.secret);
    return encrypted.toString();
  }
}
