/**
 * 生成一个UUID（通用唯一标识符）。
 *
 * UUID是一种用于软件构建的标识符，其目的是能够生成一个唯一的ID，以便在全局范围内标识信息。
 * 此函数用于生成一个符合version 4的UUID，这种UUID是随机生成的。
 *
 * 生成的UUID的格式为：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * 其中，x是任意16进制数字，y是一个16进制数字，取值范围为[8, b]。
 *
 * @returns {string} 生成的UUID。
 */
function generateUUID(): string {
  let d = Date.now();
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now(); // use high-precision timer if available
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(
    /[xy]/g,
    (c) => {
      const r = Math.trunc((d + Math.random() * 16) % 16);
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
}

export { generateUUID };
