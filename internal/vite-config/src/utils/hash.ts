import { createHash } from 'node:crypto';

function createContentHash(content: string, hashLSize = 12) {
  const hash = createHash('sha256').update(content);
  return hash.digest('hex').slice(0, hashLSize);
}

export { createContentHash };
