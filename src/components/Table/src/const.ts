const table = {
  // Form interface request general configuration
  // support xxx.xxx.xxx
  fetchSetting: {
    // The field name of the current page passed to the background
    pageField: 'page',
    // The number field name of each page displayed in the background
    sizeField: 'pageSize',
    // Field name of the form data returned by the interface
    listField: 'items',
    // Total number of tables returned by the interface field name
    totalField: 'total',
  },
  // Number of pages that can be selected
  pageSizeOptions: ['10', '50', '80', '100'],
  // Default display quantity on one page
  defaultPageSize: 10,
  // Default Size
  defaultSize: 'middle',
  // Custom general sort function
  defaultSortFn: (sortInfo: SorterResult) => {
    const { field, order } = sortInfo;
    if (field && order) {
      return {
        // The sort field passed to the backend you
        field,
        // Sorting method passed to the background asc/desc
        order,
      };
    } else {
      return {};
    }
  },
  // Custom general filter function
  defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
    return data;
  },
};
const {
  pageSizeOptions,
  defaultPageSize,
  fetchSetting,
  defaultSize,
  defaultSortFn,
  defaultFilterFn,
} = table;

export const ROW_KEY = 'key';

// Optional display number per page;
export const PAGE_SIZE_OPTIONS = pageSizeOptions;

// Number of items displayed per page
export const PAGE_SIZE = defaultPageSize;

// Common interface field settings
export const FETCH_SETTING = fetchSetting;

// Default Size
export const DEFAULT_SIZE = defaultSize;

// Configure general sort function
export const DEFAULT_SORT_FN = defaultSortFn;

export const DEFAULT_FILTER_FN = defaultFilterFn;

//  Default layout of table cells
export const DEFAULT_ALIGN = 'center';

export const INDEX_COLUMN_FLAG = 'INDEX';

export const ACTION_COLUMN_FLAG = 'ACTION';
