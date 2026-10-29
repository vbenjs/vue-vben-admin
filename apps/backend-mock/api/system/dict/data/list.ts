import { eventHandler, getQuery } from 'h3';
import { getDictDataList } from '~/utils/dict-utils';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { firstQueryString } from '~/utils/query';
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

  const { dictCode, label, status, page, pageSize } = getQuery(event);
  // 统一经 firstQueryString 规范化：同名参数重复时取首个字符串值，
  // 非字符串值按空串处理，后续逻辑只需面对 string（不再 as string）。
  const dictCodeValue = firstQueryString(dictCode);
  const labelValue = firstQueryString(label);
  const statusValue = firstQueryString(status);
  const pageValue = firstQueryString(page) || '1';
  const pageSizeValue = firstQueryString(pageSize) || '20';

  if (!dictCodeValue) {
    return useResponseError('dictCode is required');
  }

  let listData = structuredClone(getDictDataList()).filter(
    (item) => item.dictCode === dictCodeValue,
  );
  if (labelValue) {
    listData = listData.filter((item) =>
      item.label.toLowerCase().includes(labelValue.toLowerCase()),
    );
  }
  if (['0', '1'].includes(statusValue)) {
    listData = listData.filter((item) => item.status === Number(statusValue));
  }

  listData = listData.toSorted((a, b) => a.sort - b.sort);

  return usePageResponseSuccess(pageValue, pageSizeValue, listData);
});
