import { SorterResult } from 'ant-design-vue/types/table/table';

export const ROW_KEY = 'key';

export const PAGE_SIZE_OPTIONS = ['10', '50', '80', '100'];

export const PAGE_SIZE = ~~PAGE_SIZE_OPTIONS[0];

export const FETCH_SETTING = {
  pageField: 'page',
  sizeField: 'pageSize',
  listField: 'items',
  totalField: 'total',
};

export function DEFAULT_SORT_FN(sortInfo: SorterResult<any>) {
  const { field, order } = sortInfo;
  return {
    field,
    order,
  };
}
