export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

export interface BasicTableParams {
  pageNumber: number;
  pageSize: number;
  exportData?: number | string;
}

export interface BasicTableResult<T> {
  list: T[];
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRow: number;
}
