import { faker } from '@faker-js/faker';
import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  sleep,
  unAuthorizedResponse,
  usePageResponseSuccess,
} from '~/utils/response';

function generateMockDataList(count: number) {
  const dataList = [];

  for (let i = 0; i < count; i++) {
    const dataItem = {
      id: faker.string.uuid(),
      imageUrl: faker.image.avatar(),
      imageUrl2: faker.image.avatar(),
      open: faker.datatype.boolean(),
      status: faker.helpers.arrayElement(['success', 'error', 'warning']),
      productName: faker.commerce.productName(),
      price: faker.commerce.price(),
      currency: faker.finance.currencyCode(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      available: faker.datatype.boolean(),
      category: faker.commerce.department(),
      releaseDate: faker.date.past(),
      rating: faker.number.float({ min: 1, max: 5 }),
      description: faker.commerce.productDescription(),
      weight: faker.number.float({ min: 0.1, max: 10 }),
      color: faker.color.human(),
      inProduction: faker.datatype.boolean(),
      tags: Array.from({ length: 3 }, () => faker.commerce.productAdjective()),
    };

    dataList.push(dataItem);
  }

  return dataList;
}

const mockData = generateMockDataList(100);

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  await sleep(600);

  const { page, pageSize, sortBy, sortOrder } = getQuery(event);
  const listData = structuredClone(mockData);

  // 检查 sortBy 是否是 listData 元素的合法属性键
  if (
    sortBy &&
    listData[0] &&
    Object.prototype.hasOwnProperty.call(listData[0], sortBy as string)
  ) {
    // 定义数组元素的类型
    type ItemType = (typeof listData)[0];
    const sortKey = sortBy as keyof ItemType; // 将 sortBy 断言为合法键

    listData.sort((a, b) => {
      if (sortOrder === 'asc') {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        return typeof aValue === 'number' && typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue));
      } else {
        if (sortKey === 'price') {
          return (
            Number.parseFloat(b[sortKey] as string) -
            Number.parseFloat(a[sortKey] as string)
          );
        } else {
          return (a[sortKey] as string) < (b[sortKey] as string) ? 1 : -1;
        }
      }
    });
  }

  return usePageResponseSuccess(page as string, pageSize as string, listData);
});
