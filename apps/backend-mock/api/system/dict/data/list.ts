import { eventHandler, getQuery } from 'h3';
import { getDictDataList } from '~/utils/dict-utils';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  unAuthorizedResponse,
  usePageResponseSuccess,
  useResponseError,
} from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const { page = 1, pageSize = 20, dictCode, label, status } = getQuery(event);

  if (!dictCode) {
    return useResponseError('dictCode is required');
  }

  let listData = structuredClone(getDictDataList()).filter(
    (item) => item.dictCode === String(dictCode),
  );
  if (label) {
    listData = listData.filter((item) =>
      item.label.toLowerCase().includes(String(label).toLowerCase()),
    );
  }
  if (['0', '1'].includes(status as string)) {
    listData = listData.filter((item) => item.status === Number(status));
  }

  listData = listData.toSorted((a, b) => a.sort - b.sort);

  return usePageResponseSuccess(page as string, pageSize as string, listData);
});
