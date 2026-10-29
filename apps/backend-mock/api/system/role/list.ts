import { faker } from '@faker-js/faker';
import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { getMenuIds, MOCK_MENU_LIST } from '~/utils/mock-data';
import { firstQueryString } from '~/utils/query';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const formatterCN = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const menuIds = getMenuIds(MOCK_MENU_LIST);

function generateMockDataList(count: number) {
  const dataList = [];

  for (let i = 0; i < count; i++) {
    const dataItem: Record<string, any> = {
      id: faker.string.uuid(),
      name: faker.commerce.product(),
      status: faker.helpers.arrayElement([0, 1]),
      createTime: formatterCN.format(
        faker.date.between({ from: '2022-01-01', to: '2025-01-01' }),
      ),
      permissions: faker.helpers.arrayElements(menuIds),
      remark: faker.lorem.sentence(),
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

  const { name, id, remark, startTime, endTime, status, page, pageSize } =
    getQuery(event);
  // 统一经 firstQueryString 规范化：同名参数重复时取首个字符串值，
  // 非字符串值按空串处理，后续逻辑只需面对 string（不再 as string）。
  const nameValue = firstQueryString(name);
  const idValue = firstQueryString(id);
  const remarkValue = firstQueryString(remark);
  const startTimeValue = firstQueryString(startTime);
  const endTimeValue = firstQueryString(endTime);
  const statusValue = firstQueryString(status);
  const pageValue = firstQueryString(page) || '1';
  const pageSizeValue = firstQueryString(pageSize) || '20';

  let listData = structuredClone(mockData);
  if (nameValue) {
    listData = listData.filter((item) =>
      item.name.toLowerCase().includes(nameValue.toLowerCase()),
    );
  }
  if (idValue) {
    listData = listData.filter((item) =>
      item.id.toLowerCase().includes(idValue.toLowerCase()),
    );
  }
  if (remarkValue) {
    listData = listData.filter((item) =>
      item.remark?.toLowerCase()?.includes(remarkValue.toLowerCase()),
    );
  }
  if (startTimeValue) {
    listData = listData.filter((item) => item.createTime >= startTimeValue);
  }
  if (endTimeValue) {
    listData = listData.filter((item) => item.createTime <= endTimeValue);
  }
  if (['0', '1'].includes(statusValue)) {
    listData = listData.filter((item) => item.status === Number(statusValue));
  }
  return usePageResponseSuccess(pageValue, pageSizeValue, listData);
});
