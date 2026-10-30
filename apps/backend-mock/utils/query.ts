import type { H3Event, InferEventInput } from 'h3';

// getQuery 是三泛型签名，ReturnType<typeof getQuery> 无法确定默认实参
// （解析为 unknown）；改用 h3 导出的推导类型还原其默认返回形状 QueryObject。
type QueryParamValue = Exclude<
  InferEventInput<'query', H3Event, void>,
  undefined
>[string];

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

/**
 * 取查询参数的首个整数值。
 *
 * parseInt 兜底：空值/垃圾串（?page=abc）回落默认值，
 * 避免 NaN 切片清空列表。
 */
function firstQueryInt(value: QueryParamValue, defaultValue: number): number {
  return Number.parseInt(firstQueryString(value), 10) || defaultValue;
}

export { firstQueryInt, firstQueryString };
