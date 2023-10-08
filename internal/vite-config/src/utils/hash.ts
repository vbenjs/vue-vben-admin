import { createHash } from 'node:crypto';

function createContentHash(content: string, hashLSize = 12) {
  const hash = createHash('sha256').update(content);
  return hash.digest('hex').slice(0, hashLSize);
}
function strToHex(str: string) {
  const result: string[] = [];
  for (let i = 0; i < str.length; ++i) {
    const hex = str.charCodeAt(i).toString(16);
    result.push(('000' + hex).slice(-4));
  }
  return result.join('').toUpperCase();
}

export { createContentHash, strToHex };
