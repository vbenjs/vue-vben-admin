import componentSetting from '/@/settings/componentSetting';

const { table } = componentSetting;

const { pageSizeOptions, defaultPageSize, fetchSetting, defaultSortFn, defaultFilterFn } = table;

export const ROW_KEY = 'key';

// 可选的每页显示条数;
export const PAGE_SIZE_OPTIONS = pageSizeOptions;

// 每页显示条数
export const PAGE_SIZE = defaultPageSize;

// 通用接口字段设置
export const FETCH_SETTING = fetchSetting;

// 配置通用排序函数
export const DEFAULT_SORT_FN = defaultSortFn;

export const DEFAULT_FILTER_FN = defaultFilterFn;

//  表格单元格默认布局
export const DEFAULT_ALIGN = 'center';

export const INDEX_COLUMN_FLAG = 'INDEX';
export const ACTION_COLUMN_FLAG = 'ACTION';
