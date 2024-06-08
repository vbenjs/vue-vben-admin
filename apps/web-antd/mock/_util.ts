function resultSuccess<T = Record<string, any>>(
  result: T,
  { message = 'ok' } = {},
) {
  return {
    code: 0,
    message,
    result,
    type: 'success',
  };
}

function resultError(
  message = 'Request failed',
  { code = -1, result = null } = {},
) {
  return {
    code,
    message,
    result,
    type: 'error',
  };
}

/**
 * @zh_CN 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
function getRequestToken({ headers }: any): string | undefined {
  return headers?.authorization;
}

export { getRequestToken, resultError, resultSuccess };
