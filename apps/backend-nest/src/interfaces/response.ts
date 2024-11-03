export class ResponseClass<T = any> {
  constructor(
    public code: number,
    public data: T,
    public error: any,
    public message: string | string[],
  ) {}

  static Error(message: string | string[], error: any = null) {
    return new ResponseClass(-1, null, error, message);
  }

  static PageSuccess<T = any>(
    page: number | string,
    pageSize: number | string,
    list: T[],
    { message = 'ok' } = {},
  ) {
    const pageData = pagination(
      Number.parseInt(`${page}`),
      Number.parseInt(`${pageSize}`),
      list,
    );

    const result = ResponseClass.Success({
      items: pageData,
      total: list.length,
    });

    result.message = message;

    return result;
  }

  static Success<T = null>(data: T) {
    return new ResponseClass(0, data, null, 'ok');
  }
}

export function pagination<T = any>(
  pageNo: number,
  pageSize: number,
  array: T[],
): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset)
    : array.slice(offset, offset + Number(pageSize));
}
