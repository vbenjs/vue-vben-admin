import { getQuery } from 'h3';

type QueryParamValue = ReturnType<typeof getQuery>[string];

/**
 * 取查询参数的首个字符串值。
 *
 * h3 的查询参数可能是数组（同名参数重复出现时）或其它标量，
 * 直接 String() 会得到逗号拼接结果甚至 "[object Object]"；
 * mock 接口的筛选语义只关心首个字符串值。
 */
function firstQueryString(value: QueryParamValue): string {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : '';
  }
  return typeof value === 'string' ? value : '';
}

export { firstQueryString };
