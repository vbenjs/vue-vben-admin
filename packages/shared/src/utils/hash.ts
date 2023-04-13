/**
 * @description 生成UUID
 */
function generateUUID(): string {
  const hexVals = '0123456789abcdef';
  let uuid = '';
  for (let i = 0; i < 36; i++) {
    let randVal = (Math.random() * 16) | 0;
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4';
    } else if (i === 19) {
      uuid += hexVals[(randVal & 0x3) | 0x8];
      randVal = (Math.random() * 4) | 8;
    }
    uuid += hexVals[randVal];
  }
  return uuid.replace(/-/g, '');
}

export { generateUUID };
