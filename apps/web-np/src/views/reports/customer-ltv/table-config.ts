import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { markRaw, reactive } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { customerGetLTVReport } from '#/api';
import dayjs from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

import { generateDateColumns, transformDataRowToColumn } from './service';

const gridOptions: VxeTableGridOptions = {
  pagerConfig: {
    enabled: false,
  },
  toolbarConfig: {
    search: true,
    refresh: true,
    zoom: true,
  },
  rowConfig: {
    height: 54,
    isHover: true,
  },
  exportConfig: {},
  minHeight: 300,
  maxHeight: 1000,
  border: true,
  columns: [],
  cellClassName: ({ row, column }) => {
    if (column.field === 'id' || column.field === 'totalRevenue') {
      return;
    }

    const addMonth: any = +column.field - 1;
    const currenMonth = dayjs(row.customerMonth)
      .add(addMonth, 'month')
      .format('YYYY-MM');

    if (row[currenMonth] === undefined) {
      return 'invisible';
    }

    if (row.currenMonthColumn === +column.field) {
      return 'bg-background-deep font-semibold';
    }
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        state.loading = true;
        const data: any = await customerGetLTVReport({
          ...formValues,
        }).finally(() => {
          state.loading = false;
        });

        state.tableData = data.items;

        if (data.items.length === 0) {
          return data;
        }

        generateDateColumns(gridApi, formValues);

        data.items = transformDataRowToColumn(data.items, formValues);

        return data;
      },
    },
  },
};

const formOptions: VbenFormProps = {
  collapsed: false,
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  fieldMappingTime: [['month', ['fromMonth', 'toMonth']]],
  schema: [
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        picker: 'month',
        pickerLimit: 6,
        presets: getDatePreset(
          ['last3Months', 'last6Months', 'lastYear', 'thisYear'],
          true,
        ),
      },
      defaultValue: [dayjs().add(-6, 'months'), dayjs()],
      fieldName: 'month',
      label: 'Month',
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const state = reactive({
  tableData: [],
  loading: false,
});

export { Grid, gridApi, state };
