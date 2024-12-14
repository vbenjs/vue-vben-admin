import { faker } from '@faker-js/faker';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse } from '~/utils/response';

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
  if (sortBy && Reflect.has(listData[0], sortBy as string)) {
    listData.sort((a, b) => {
      if (sortOrder === 'asc') {
        if (sortBy === 'price') {
          return (
            Number.parseFloat(a[sortBy as string]) -
            Number.parseFloat(b[sortBy as string])
          );
        } else {
          return a[sortBy as string] > b[sortBy as string] ? 1 : -1;
        }
      } else {
        if (sortBy === 'price') {
          return (
            Number.parseFloat(b[sortBy as string]) -
            Number.parseFloat(a[sortBy as string])
          );
        } else {
          return a[sortBy as string] < b[sortBy as string] ? 1 : -1;
        }
      }
    });
  }

  return usePageResponseSuccess(page as string, pageSize as string, listData);
});
