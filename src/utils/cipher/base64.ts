import Base64 from 'crypto-js/enc-base64';
import UTF8 from 'crypto-js/enc-utf8';

/** base64加密
 * @param {string} text 文本
 * @returns {string} 密文(可逆)
 */
export function encodeByBase64(text: string) {
  return Base64.stringify(UTF8.parse(text));
}

/** base64解密
 * @param {string} ciphertext 密文
 * @returns {string} 密文(可逆)
 */
export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8);
}
