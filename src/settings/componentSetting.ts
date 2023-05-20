// Used to configure the general configuration of some components without modifying the components

import type { SorterResult } from '../components/Table';

export default {
  // basic-table setting
  table: {
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
  // scrollbar setting
  scrollbar: {
    // Whether to use native scroll bar
    // After opening, the menu, modal, drawer will change the pop-up scroll bar to native
    native: false,
  },
};
