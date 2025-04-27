// @ts-nocheck 加解密算法实现
/**
 * AES 加密算法实现
 * 使用纯 JavaScript 实现 AES-128-ECB 加密
 */

// AES S-box
const SBOX: number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe,
  0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4,
  0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7,
  0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3,
  0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09,
  0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3,
  0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe,
  0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
  0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92,
  0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c,
  0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19,
  0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
  0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2,
  0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5,
  0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25,
  0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86,
  0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e,
  0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42,
  0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
];

// AES inverted S-box
const INV_SBOX: number[] = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81,
  0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e,
  0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23,
  0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66,
  0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72,
  0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65,
  0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46,
  0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a,
  0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca,
  0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91,
  0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6,
  0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
  0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f,
  0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2,
  0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8,
  0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93,
  0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb,
  0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6,
  0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
];

// Round constants
const RCON: number[] = [
  0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
];

/**
 * 字符串转换为字节数组
 */
function stringToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.codePointAt(i));
  }
  return bytes;
}

/**
 * 字节数组转换为字符串
 */
function bytesToString(bytes: number[]): string {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

/**
 * 生成密钥调度
 */
function keyExpansion(key: number[]): number[][] {
  const expandedKey: number[][] = [];

  // 初始轮密钥
  for (let i = 0; i < 4; i++) {
    expandedKey[i] = [
      key[4 * i],
      key[4 * i + 1],
      key[4 * i + 2],
      key[4 * i + 3],
    ];
  }

  // 扩展密钥
  for (let i = 4; i < 44; i++) {
    let temp = [...expandedKey[i - 1]];

    if (i % 4 === 0) {
      // 循环左移
      temp = [temp[1], temp[2], temp[3], temp[0]];

      // S-box替换
      for (let j = 0; j < 4; j++) {
        temp[j] = SBOX[temp[j]];
      }

      // 轮常量异或
      temp[0] ^= RCON[i / 4 - 1];
    }

    expandedKey[i] = [
      expandedKey[i - 4][0] ^ temp[0],
      expandedKey[i - 4][1] ^ temp[1],
      expandedKey[i - 4][2] ^ temp[2],
      expandedKey[i - 4][3] ^ temp[3],
    ];
  }

  return expandedKey;
}

/**
 * 将字节数组转换为4x4状态矩阵
 */
function bytesToState(bytes: number[]): number[][] {
  const state: number[][] = [[], [], [], []];
  for (let i = 0; i < 16; i++) {
    state[i % 4][Math.floor(i / 4)] = bytes[i];
  }
  return state;
}

/**
 * 将4x4状态矩阵转换为字节数组
 */
function stateToBytes(state: number[][]): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      bytes.push(state[j][i]);
    }
  }
  return bytes;
}

/**
 * 字节替换操作
 */
function subBytes(state: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = SBOX[state[i][j]];
    }
  }
}

/**
 * 逆字节替换操作
 */
function invSubBytes(state: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = INV_SBOX[state[i][j]];
    }
  }
}

/**
 * 行移位操作
 */
function shiftRows(state: number[][]): void {
  const temp = [[...state[0]], [...state[1]], [...state[2]], [...state[3]]];

  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = temp[i][(j + i) % 4];
    }
  }
}

/**
 * 逆行移位操作
 */
function invShiftRows(state: number[][]): void {
  const temp = [[...state[0]], [...state[1]], [...state[2]], [...state[3]]];

  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = temp[i][(j - i + 4) % 4];
    }
  }
}

/**
 * 在 GF(2^8) 上的乘法
 */
function gmul(a: number, b: number): number {
  let p = 0;
  let hiBit;
  for (let i = 0; i < 8; i++) {
    if ((b & 1) !== 0) {
      p ^= a;
    }
    hiBit = a & 0x80;
    a <<= 1;
    if (hiBit !== 0) {
      a ^= 0x1b; // x^8 + x^4 + x^3 + x + 1
    }
    b >>= 1;
  }
  return p & 0xff;
}

/**
 * 列混合操作
 */
function mixColumns(state: number[][]): void {
  const temp = [[...state[0]], [...state[1]], [...state[2]], [...state[3]]];

  for (let i = 0; i < 4; i++) {
    state[0][i] =
      gmul(0x02, temp[0][i]) ^ gmul(0x03, temp[1][i]) ^ temp[2][i] ^ temp[3][i];
    state[1][i] =
      temp[0][i] ^ gmul(0x02, temp[1][i]) ^ gmul(0x03, temp[2][i]) ^ temp[3][i];
    state[2][i] =
      temp[0][i] ^ temp[1][i] ^ gmul(0x02, temp[2][i]) ^ gmul(0x03, temp[3][i]);
    state[3][i] =
      gmul(0x03, temp[0][i]) ^ temp[1][i] ^ temp[2][i] ^ gmul(0x02, temp[3][i]);
  }
}

/**
 * 逆列混合操作
 */
function invMixColumns(state: number[][]): void {
  const temp = [[...state[0]], [...state[1]], [...state[2]], [...state[3]]];

  for (let i = 0; i < 4; i++) {
    state[0][i] =
      gmul(0x0e, temp[0][i]) ^
      gmul(0x0b, temp[1][i]) ^
      gmul(0x0d, temp[2][i]) ^
      gmul(0x09, temp[3][i]);
    state[1][i] =
      gmul(0x09, temp[0][i]) ^
      gmul(0x0e, temp[1][i]) ^
      gmul(0x0b, temp[2][i]) ^
      gmul(0x0d, temp[3][i]);
    state[2][i] =
      gmul(0x0d, temp[0][i]) ^
      gmul(0x09, temp[1][i]) ^
      gmul(0x0e, temp[2][i]) ^
      gmul(0x0b, temp[3][i]);
    state[3][i] =
      gmul(0x0b, temp[0][i]) ^
      gmul(0x0d, temp[1][i]) ^
      gmul(0x09, temp[2][i]) ^
      gmul(0x0e, temp[3][i]);
  }
}

/**
 * 轮密钥加操作
 */
function addRoundKey(state: number[][], roundKey: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] ^= roundKey[i][j];
    }
  }
}

/**
 * 派生一个128位密钥
 */
function deriveKey(password: string): number[] {
  // 简单的哈希函数生成固定长度密钥
  const key: number[] = Array.from({ length: 16 }).fill(0);
  const bytes = stringToBytes(password);

  for (const [i, byte] of bytes.entries()) {
    key[i % 16] ^= byte;
  }

  // 进一步混淆密钥
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 16; j++) {
      key[j] = SBOX[(key[j] + key[(j + 1) % 16]) % 256];
    }
  }

  return key;
}

/**
 * 对单个数据块进行 AES 加密
 */
function aesEncryptBlock(block: number[], expandedKey: number[][]): number[] {
  const state = bytesToState(block);

  // 初始轮密钥加
  addRoundKey(state, expandedKey.slice(0, 4));

  // 9个标准回合
  for (let round = 1; round < 10; round++) {
    subBytes(state);
    shiftRows(state);
    mixColumns(state);
    addRoundKey(state, expandedKey.slice(round * 4, (round + 1) * 4));
  }

  // 最终回合（无列混合）
  subBytes(state);
  shiftRows(state);
  addRoundKey(state, expandedKey.slice(40, 44));

  return stateToBytes(state);
}

/**
 * 对单个数据块进行 AES 解密
 */
function aesDecryptBlock(block: number[], expandedKey: number[][]): number[] {
  const state = bytesToState(block);

  // 初始轮密钥加
  addRoundKey(state, expandedKey.slice(40, 44));

  // 9个标准回合
  for (let round = 9; round > 0; round--) {
    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, expandedKey.slice(round * 4, (round + 1) * 4));
    invMixColumns(state);
  }

  // 最终回合（无列混合）
  invShiftRows(state);
  invSubBytes(state);
  addRoundKey(state, expandedKey.slice(0, 4));

  return stateToBytes(state);
}

/**
 * 使用PKCS#7填充
 */
function pkcs7Pad(data: number[], blockSize: number = 16): number[] {
  const padLength = blockSize - (data.length % blockSize);
  const result = [...data];

  for (let i = 0; i < padLength; i++) {
    result.push(padLength);
  }

  return result;
}

/**
 * 去除PKCS#7填充
 */
function pkcs7Unpad(data: number[]): number[] {
  const paddingLength = data[data.length - 1];

  if (paddingLength <= 0 || paddingLength > 16) {
    throw new Error('Invalid padding');
  }

  // 检查填充是否正确
  for (let i = data.length - paddingLength; i < data.length; i++) {
    if (data[i] !== paddingLength) {
      throw new Error('Invalid padding');
    }
  }

  return data.slice(0, data.length - paddingLength);
}

/**
 * 加密主函数
 */
function aesEncrypt(data: string, key: string): string {
  const derivedKey = deriveKey(key);
  const expandedKey = keyExpansion(derivedKey);
  const dataBytes = stringToBytes(data);
  const paddedData = pkcs7Pad(dataBytes);
  const encryptedBytes: number[] = [];

  // 分块处理
  for (let i = 0; i < paddedData.length; i += 16) {
    const block = paddedData.slice(i, i + 16);
    const encryptedBlock = aesEncryptBlock(block, expandedKey);
    encryptedBytes.push(...encryptedBlock);
  }

  return bytesToString(encryptedBytes);
}

/**
 * 解密主函数
 */
function aesDecrypt(data: string, key: string): string {
  const derivedKey = deriveKey(key);
  const expandedKey = keyExpansion(derivedKey);
  const dataBytes = stringToBytes(data);
  const decryptedBytes: number[] = [];

  // 分块处理
  for (let i = 0; i < dataBytes.length; i += 16) {
    const block = dataBytes.slice(i, i + 16);
    const decryptedBlock = aesDecryptBlock(block, expandedKey);
    decryptedBytes.push(...decryptedBlock);
  }

  // 去除填充
  const unpaddedData = pkcs7Unpad(decryptedBytes);
  return bytesToString(unpaddedData);
}

/**
 * 计算字符串的哈希值 (类 FNV-1a 算法)
 * @param str 需要计算哈希的字符串
 * @returns 32位固定长度的哈希字符串
 */
export function hashString(str: string): string {
  // FNV 参数 (32位版本)
  const FNV_PRIME = 16_777_619;
  const OFFSET_BASIS = 2_166_136_261;

  let hash = OFFSET_BASIS;

  // 对每个字符进行哈希计算
  for (let i = 0; i < str.length; i++) {
    hash ^= str.codePointAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }

  // 确保生成的哈希为 32 位无符号整数
  hash = hash >>> 0;

  // 转换为 16 进制字符串并补全到 8 位
  let hexHash = hash.toString(16);
  while (hexHash.length < 8) {
    hexHash = `0${hexHash}`;
  }

  // 扩展哈希到 32 位长度
  let result = '';
  for (let i = 0; i < 4; i++) {
    // 将哈希混合并循环使用
    const part = ((hash >> (i * 8)) ^ (hash << ((4 - i) * 8))) >>> 0;
    let hexPart = part.toString(16);
    while (hexPart.length < 8) {
      hexPart = `0${hexPart}`;
    }
    result += hexPart;
  }

  return result;
}

/**
 * 对数据进行序列化、加密操作
 * @param data 需要处理的数据
 * @param key 加密的密钥
 * @returns 加密后的Base64字符串
 */
export function encrypt(data: any, key: string): string {
  const value = JSON.stringify(data);
  const hash = hashString(value);
  const toEncrypt = JSON.stringify({
    hash,
    value,
  });
  const result = aesEncrypt(toEncrypt, key);
  return btoa(result);
}

/**
 * 对数据进行解密、反序列化操作
 * @param raw 需要处理的密文
 * @param key 解密的密钥
 * @returns 解密并反序列化后的数据
 */
export function decrypt(raw: string, key: string): any {
  if (!raw) return undefined;
  try {
    const decodedData = atob(raw);
    const decryptedData = aesDecrypt(decodedData, key);
    const value = JSON.parse(decryptedData);
    if (
      value &&
      value.hash &&
      value.value &&
      value.hash === hashString(value.value)
    ) {
      return JSON.parse(value.value);
    } else {
      console.error('decrypt error: Hash mismatch or invalid data format');
      return undefined;
    }
  } catch (error) {
    console.error('decrypt error:', error);
    return undefined;
  }
}
