import JSEncrypt from 'jsencrypt';

/**
 * 公钥加密
 * @param publicKey 公钥
 * @param hash 待加密值
 * @returns 公钥加密且经过Base64加密后的值
 */
export function RSAEncrypt(publicKey: string, hash: string): string {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(hash);
}
