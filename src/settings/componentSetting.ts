// 用於配置某些組件的一般配置，而不需要修改組件本身

import type { SorterResult } from '../components/Table';

export default {
  // 基本表格配置
  table: {
    // 表單接口請求的一般配置
    // 支持 xxx.xxx.xxx
    fetchSetting: {
      // 傳遞給後端的當前頁面的字段名稱
      pageField: 'page',
      // 傳遞給後端的每頁顯示數量的字段名稱
      sizeField: 'pageSize',
      // 接口返回的表單數據的字段名稱
      listField: 'items',
      // 接口返回的表格總數字段名稱
      totalField: 'total',
    },
    // 可選擇的每頁顯示數量
    pageSizeOptions: ['10', '50', '80', '100'],
    // 默認每頁顯示數量
    defaultPageSize: 10,
    // 默認大小
    defaultSize: 'middle',
    // 自定義的一般排序函數
    defaultSortFn: (sortInfo: SorterResult) => {
      const { field, order } = sortInfo;
      if (field && order) {
        return {
          // 傳遞給後端的排序字段
          field,
          // 傳遞給後端的排序方式 asc/desc
          order,
        };
      } else {
        return {};
      }
    },
    // 自定義的一般過濾函數
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
      return data;
    },
  },
  vxeTable: {
    table: {
      border: true,
      stripe: true,
      columnConfig: {
        resizable: true,
        isCurrent: true,
        isHover: true,
      },
      rowConfig: {
        isCurrent: true,
        isHover: true,
      },
      emptyRender: {
        name: 'AEmpty',
      },
      printConfig: {},
      exportConfig: {},
      customConfig: {
        storage: true,
      },
    },
    grid: {
      toolbarConfig: {
        enabled: true,
        export: true,
        zoom: true,
        print: true,
        refresh: true,
        custom: true,
      },
      pagerConfig: {
        pageSizes: [20, 50, 100, 500],
        pageSize: 20,
        autoHidden: true,
      },
      proxyConfig: {
        form: true,
        props: {
          result: 'items',
          total: 'total',
        },
      },
      zoomConfig: {},
    },
  },
  // 滾動條配置
  scrollbar: {
    // 是否使用原生滾動條
    // 開啟後，菜單、模態框、抽屜將會將彈出的滾動條改為原生的
    native: false,
  },
};
