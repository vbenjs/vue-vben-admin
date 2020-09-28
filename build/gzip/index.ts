// Build gzip after packaging
// import { readFile, writeFile } from 'fs';
import viteConfig from '../../vite.config';
import {
  // basename,
  join,
} from 'path';
// import { promisify } from 'util';
// import { gzip, ZlibOptions } from 'zlib';
import { readAllFile } from '../utils';

// const readFilePromise = promisify(readFile);
// const writeFilePromise = promisify(writeFile);

// function createGzip() {}

const FILE_REG = /\.(js|mjs|json|css|html)$/;

const OUT_DIR = viteConfig.outDir || 'dist';

// TODO 待开发
const files = readAllFile(join(process.cwd(), OUT_DIR), FILE_REG);
