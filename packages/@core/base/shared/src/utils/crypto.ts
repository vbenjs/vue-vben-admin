export function rc4(key: string, data: string): string {
  const S: number[] = [];
  let j: number = 0;
  const result: number[] = [];

  // 初始化 S 盒
  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }

  // 初始置换
  for (let i = 0; i < 256; i++) {
    j =
      (j + (S[i] as number) + (key.codePointAt(i % key.length) as number)) %
      256;
    [S[i] as number, S[j] as number] = [S[j] as number, S[i] as number];
  }

  let i: number = 0;
  j = 0;
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) % 256;
    j = (j + (S[i] as number)) % 256;
    [S[i] as number, S[j] as number] = [S[j] as number, S[i] as number];
    const t = ((S[i] as number) + (S[j] as number)) % 256;
    const keystreamByte = S[t] as number;
    result.push((data.codePointAt(k) as number) ^ keystreamByte);
  }

  return String.fromCharCode.apply(null, result);
}

/**
 * 对数据进行序列化、加密操作
 * @param data 需要处理的数据
 * @param key 加密的密钥
 * @returns
 */
export function encrypt(data: any, key: string): string {
  const result = rc4(key, JSON.stringify(data));
  return btoa(result);
}

/**
 * 对数据进行解密、反序列化操作
 * @param raw 需要处理的密文
 * @param key 解密的密钥
 * @returns
 */
export function decrypt(raw: string, key: string): any {
  try {
    const decodedData = atob(raw);
    const decryptedData = rc4(key, decodedData);
    return JSON.parse(decryptedData);
  } catch {
    return undefined;
  }
}
