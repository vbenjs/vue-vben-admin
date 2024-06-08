import { createProdMockServer } from 'vite-plugin-mock/client';

// 逐一导入您的mock.ts文件
// 如果使用vite.mock.config.ts，只需直接导入文件
// 可以使用 import.meta.glob功能来进行全部导入
import userModule from '../mock/user';

export function setupProdMockServer() {
  createProdMockServer([...userModule]);
}
