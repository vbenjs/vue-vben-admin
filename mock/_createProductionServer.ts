import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
import userMock from './sys/user';
import menuMock from './sys/menu';

export function setupProdMockServer() {
  createProdMockServer([...userMock, ...menuMock]);
}
