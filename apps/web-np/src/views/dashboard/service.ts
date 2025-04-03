import { reactive } from 'vue';

import dayjs from 'dayjs';

import { getPAndLReport } from '#/api';

export const state = reactive({
  orderLoading: false,
  dateRange: [dayjs().subtract(7, 'd'), dayjs()],
});

export const reloadData = () => {
  state.orderLoading = true;
  getPAndLReport({
    groupBy: 'daily',
    fromDate: state.dateRange[0]?.format('YYYY-MM-DD'),
    toDate: state.dateRange[1]?.format('YYYY-MM-DD'),
  }).finally(() => {
    state.orderLoading = false;
  });
};
