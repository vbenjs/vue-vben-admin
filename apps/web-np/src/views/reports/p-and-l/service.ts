import type { ExtendedVxeGridApi } from 'node_modules/@vben/plugins/src/vxe-table/types';
import type { VxeGridPropTypes } from 'vxe-table';

import { adType } from '#/shared/constants';
import dayjs from '#/shared/dayjs';

export const groupData = (dataItems: any, groupBy: string) => {
  const newDataItems: any[] = [];

  dataItems.forEach((record: any) => {
    let _dateName: string = '';

    if (groupBy === 'weekly') {
      const __date = dayjs(record.date);
      const weekNumber = __date.week();
      const yearNumber = __date.format('YYYY');

      _dateName = `${yearNumber}-W${weekNumber}`;
    } else if (groupBy === 'quarter') {
      const __date = dayjs(record.date);
      const quarterNumber = __date.quarter();
      const yearNumber = __date.format('YYYY');

      _dateName = `${yearNumber}-Q${quarterNumber}`;
    } else {
      _dateName = dayjs(record.date).format('YYYY-MM');
    }

    const existingRecord = newDataItems.find((item) => item.date === _dateName);

    if (existingRecord) {
      for (const key in record) {
        if (key !== 'date') {
          existingRecord[key] = (existingRecord[key] || 0) + record[key];
        }
      }
    } else {
      newDataItems.push({
        ...record,
        date: _dateName,
      });
    }
  });

  return newDataItems;
};

export const createTotalRow = (dataItems: any) => {
  // eslint-disable-next-line unicorn/no-array-reduce
  const totalRow = dataItems.reduce((acc: any, record: any) => {
    for (const key in record) {
      if (key !== 'date') {
        acc[key] = (acc[key] || 0) + record[key];
      }
    }
    return acc;
  }, {});

  totalRow.date = 'Total';

  return totalRow;
};

export const generateDateColumns = (
  gridApi: ExtendedVxeGridApi,
  data: any[],
) => {
  const ymCols: VxeGridPropTypes.Columns = [
    {
      title: 'Date',
      field: 'id',
      slots: { default: 'id' },
      width: 200,
      align: 'left',
      treeNode: true,
    },
  ];

  data.forEach((item) => {
    ymCols.push({
      title: item.date,
      field: item.date,
      width: 150,
      align: 'right',
      slots: { default: 'date' },
    });
  });

  gridApi.setGridOptions({
    columns: ymCols,
  });
};

export const transformDataRowToColumn = (data: any[], costName: any): any[] => {
  const result: any[] = [];

  if (data.length === 0) return result;

  const keys = Object.keys(data[0]).filter((key) => {
    return (
      key !== 'date' &&
      key !== 'quantityTotal' &&
      key !== 'quantityRefund' &&
      key !== 'totalTip' &&
      key !== 'totalShipping' &&
      key !== 'totalOrders'
    );
  });

  keys.forEach((key) => {
    const obj: any = { id: key };
    data.forEach((entry) => {
      obj[entry.date] = entry[key];
    });

    // Check key include string 'totalCustomCost'
    if (key.includes('totalCustomCost_')) {
      obj.parentId = 'totalCustomCost';

      const costId: any = key.split('_')[1];
      obj.costName = 'N/A';

      if (costName[costId]) {
        obj.costName = costName[costId];
      }
    }

    // Check key include string 'totalAdSpend'
    if (key.includes('totalAdSpend_')) {
      obj.parentId = 'totalAdSpend';

      const adChannel: any = key.split('_')[1];
      obj.costName = 'N/A';

      adType.forEach((type: any) => {
        if (type.value === adChannel) {
          obj.costName = type.label;
        }
      });
    }

    result.push(obj);
  });

  return result;
};
