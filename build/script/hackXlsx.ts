import fs from 'fs-extra';

import path from 'path';

// Because xlsx internally references the node module, the pre-optimization of vite2.0 fails. Since the node module inside xlsx is not used on the web side, all the code that uses the node module is replaced with `{}` to be compatible with'vite2'
function replaceCjs() {
  const xlsx = path.resolve(process.cwd(), 'node_modules/xlsx/xlsx.js');
  let raw = fs.readFileSync(xlsx, 'utf-8');

  raw = raw
    .replace(`require('fs')`, '{}')
    .replace(`require('stream')`, '{}')
    .replace(`require('crypto')`, '{}');
  fs.writeFileSync(xlsx, raw);
}

replaceCjs();
