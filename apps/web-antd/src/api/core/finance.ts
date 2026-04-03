import { requestClient } from '#/api/request';

export const financeReimbursementApi = {
  getDetail: (billNo: string) =>
    requestClient.get('/finance/reimbursement/detail', { params: { billNo } }),
  getList: (params?: any) =>
    requestClient.get('/finance/reimbursement/list', { params }),
};

export const financePaymentApi = {
  getDetail: (billNo: string) =>
    requestClient.get('/finance/payment/detail', { params: { billNo } }),
  getList: (params?: any) =>
    requestClient.get('/finance/payment/list', { params }),
};

export const financeVoucherApi = {
  getList: (params?: any) =>
    requestClient.get('/finance/voucher/list', { params }),
};

export const financeWorkflowApi = {
  getHistory: (params?: any) =>
    requestClient.get('/finance/workflow/history', { params }),
  runCommand: (
    action:
      | 'add-sign'
      | 'approve'
      | 'reject'
      | 'remind'
      | 'submit'
      | 'withdraw',
    data?: any,
  ) => requestClient.post(`/finance/workflow/command/${action}`, data),
  getWorkbenchList: (params?: any) =>
    requestClient.get('/finance/workflow/workbench/list', { params }),
};

export const invoiceFolderApi = {
  getList: (params?: any) => requestClient.get('/invoice-folder/list', { params }),
  getById: (id: number | string) => requestClient.get(`/invoice-folder/${id}`),
  create: (data: any) => requestClient.post('/invoice-folder', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/invoice-folder/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/invoice-folder/${id}`),
};

export const incomeSettlementApi = {
  getList: (params?: any) => requestClient.get('/income-settlement/list', { params }),
  getById: (id: number | string) => requestClient.get(`/income-settlement/${id}`),
  create: (data: any) => requestClient.post('/income-settlement', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/income-settlement/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/income-settlement/${id}`),
};

export default {
  financePaymentApi,
  financeReimbursementApi,
  financeVoucherApi,
  financeWorkflowApi,
  invoiceFolderApi,
  incomeSettlementApi,
};
