// Interface data format used to return a unified format

export interface requestParams {
  method: string
  body: any
  headers?: { authorization?: string }
  query: any
}

export const resultSuccess = <T = Recordable>(
  result: T,
  { message = 'ok' } = {},
) => ({
  code: 0,
  result,
  message,
  type: 'success',
})

export const resultPageSuccess = <T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { message = 'ok' } = {},
) => {
  const pageData = pagination(page, pageSize, list)

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length,
    }),
    message,
  }
}

export const resultError = (
  message = 'Request failed',
  { code = -1, result = null } = {},
) => ({
  code,
  result,
  message,
  type: 'error',
})

export const pagination = <T = any>(
  pageNo: number,
  pageSize: number,
  array: T[],
): T[] => {
  const offset = (pageNo - 1) * Number(pageSize)
  const ret =
    offset + Number(pageSize) >= array.length
      ? array.slice(offset, array.length)
      : array.slice(offset, offset + Number(pageSize))
  return ret
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export const getRequestToken = ({
  headers,
}: requestParams): string | undefined => headers?.authorization
