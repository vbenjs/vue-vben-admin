import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
import userMock from './sys/user';
import menuMock from './sys/menu';
import tableDemoMock from './demo/table-demo';

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer([...userMock, ...menuMock, ...tableDemoMock]);
}
