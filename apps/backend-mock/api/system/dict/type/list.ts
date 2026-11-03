import { eventHandler, getQuery } from 'h3';
import { getDictTypes } from '~/utils/dict-utils';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { firstQueryInt, firstQueryString } from '~/utils/query';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const { name, code, status, page, pageSize } = getQuery(event);
  // 统一经 firstQueryString 规范化：同名参数重复时取首个字符串值，
  // 非字符串值按空串处理，后续逻辑只需面对 string（不再 as string）。
  const nameValue = firstQueryString(name);
  const codeValue = firstQueryString(code);
  const statusValue = firstQueryString(status);
  const pageNumber = firstQueryInt(page, 1);
  const pageSizeNumber = firstQueryInt(pageSize, 20);

  let listData = structuredClone(getDictTypes());
  if (nameValue) {
    listData = listData.filter((item) =>
      item.name.toLowerCase().includes(nameValue.toLowerCase()),
    );
  }
  if (codeValue) {
    listData = listData.filter((item) =>
      item.code.toLowerCase().includes(codeValue.toLowerCase()),
    );
  }
  if (['0', '1'].includes(statusValue)) {
    listData = listData.filter((item) => item.status === Number(statusValue));
  }

  return usePageResponseSuccess(pageNumber, pageSizeNumber, listData);
});
