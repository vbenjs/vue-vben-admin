export function useResponseSuccess<T = any>(data: T) {
  return {
    code: 0,
    data,
    error: null,
    message: 'ok',
  };
}

export function useResponseError(message: string, error: any = null) {
  return {
    code: -1,
    data: null,
    error,
    message,
  };
}
