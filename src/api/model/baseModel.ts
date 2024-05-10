export interface BasicPageParams<T = Record<string, any>> {
  page: number;
  pageSize: number;
  query: Partial<T>;
}

export interface PaginationMeta {
  itemCount: number;
  totalItems?: number;
  itemsPerPage: number;
  totalPages?: number;
  currentPage: number;
}
export interface BasicPaginationResult<T> {
  items: T[];
  meta: PaginationMeta;
}
