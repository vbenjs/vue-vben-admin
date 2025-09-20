import type { ExtendedVxeGridApi } from 'node_modules/@vben/plugins/src/vxe-table/types';
import type { VxeGridPropTypes } from 'vxe-table';

import dayjs from '#/shared/dayjs';

function getOrdinalSuffix(n: number): any {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;

  return s[(v - 20) % 10] || s[v] || s[0];
}

export const generateDateColumns = (
  gridApi: ExtendedVxeGridApi,
  formValues: any,
) => {
  const ymCols: VxeGridPropTypes.Columns = [
    {
      title: 'First Purchase In',
      field: 'id',
      slots: { default: 'id' },
      minWidth: 150,
      align: 'left',
    },
  ];

  ymCols.push({
    field: 'totalRevenue',
    title: 'Total Revenue',
    width: 150,
    align: 'right',
    slots: { default: 'totalRevenue' },
  });

  const fromMonth = formValues.fromMonth.slice(0, 7);
  const toMonth = formValues.toMonth.slice(0, 7);
  let currentMonth = fromMonth;

  // Loop from toMonth to fromMonth
  while (currentMonth <= toMonth) {
    // Title: 1st Month, 2nd Month, 3rd Month, 4th Month, ...
    const monthDifference = dayjs(currentMonth).diff(fromMonth, 'month') + 1;

    // Create the title with the correct ordinal suffix
    const title = `${monthDifference}${getOrdinalSuffix(monthDifference)} Month`;

    ymCols.push({
      field: monthDifference.toString(),
      title,
      width: 150,
      align: 'right',
      slots: { default: 'date' },
    });

    currentMonth = dayjs(currentMonth).add(1, 'month').format('YYYY-MM');
  }

  gridApi.setGridOptions({
    columns: ymCols,
  });
};

export const transformDataRowToColumn = (
  data: any[],
  formValues: any,
): any[] => {
  const result: any[] = [];

  const fromMonth = formValues.fromMonth.slice(0, 7);
  const toMonth = formValues.toMonth.slice(0, 7);
  let customerMonth = fromMonth;

  // Loop from toMonth to fromMonth
  while (customerMonth <= toMonth) {
    const item = generateRowData(data, customerMonth, toMonth);
    result.push(item);

    customerMonth = dayjs(customerMonth).add(1, 'month').format('YYYY-MM');
  }

  return result;
};

const generateRowData = (
  data: any[],
  customerMonth: string,
  maxMonth: string,
): any[] => {
  const item: any = {
    id: customerMonth,
    customerMonth,
    totalRevenue: 0,
    quantityNew: 0,
    quantityRepurchase: 0,
  };

  let processedMonth = customerMonth;
  let counter = 0;

  while (processedMonth <= maxMonth) {
    const foundDB = data.find(
      (entry) =>
        entry.processedMonth === processedMonth &&
        entry.customerMonth === customerMonth,
    );

    item.processedMonth = processedMonth;

    const netPayment = foundDB ? foundDB.netPayment : 0;
    item[processedMonth] = netPayment;
    item.totalRevenue += netPayment;

    if (!item.quantityNew && foundDB) {
      item.quantityNew = foundDB.quantityNew;
    }

    if (!item.quantityRepurchase && foundDB) {
      item.quantityRepurchase = foundDB.quantityRepurchase;
    }

    processedMonth = dayjs(processedMonth).add(1, 'month').format('YYYY-MM');
    counter++;
  }

  item.currentMonthColumn = counter;

  return item;
};
