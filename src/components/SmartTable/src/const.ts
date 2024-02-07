import componentSetting from '@/settings/componentSetting';

const { table } = componentSetting;

const { pageSizeOptions, defaultPageSize, fetchSetting, pageLayouts, defaultSize } = table;

// Optional display number per page;
export const PAGE_SIZE_OPTIONS = pageSizeOptions;

// Number of items displayed per page
export const PAGE_SIZE = defaultPageSize;

// Common interface field settings
export const FETCH_SETTING = fetchSetting;

// Default Size
export const DEFAULT_SIZE = defaultSize;

export const DEFAULT_PAGE_LAYOUTS = pageLayouts;

export const ACTION_COLUMN_FLAG = 'ACTION';

export enum SmartTableCode {
  /**
   * 是否显示搜索
   */
  showSearch = 'show_search',
  /**
   * 列配置
   */
  column = 'column',
}
