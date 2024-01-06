export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  records: T[];
  total: number;
  current: number;
  pages: number;
}
