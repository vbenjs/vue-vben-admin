import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
import userMock from './sys/user';
import menuMock from './sys/menu';
import tableDemoMock from './demo/table-demo';

export function setupProdMockServer() {
  createProdMockServer([...userMock, ...menuMock, ...tableDemoMock]);
}
