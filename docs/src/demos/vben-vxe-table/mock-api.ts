import { MOCK_TABLE_DATA } from './table-data';

export const getTableList = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TABLE_DATA);
    }, 600);
  });
