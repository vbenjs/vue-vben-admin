import { requestClient } from '#/api/request';

/**
 * ================= SysTenant API =================
 */
export const sysTenantApi = {
  getList: (params?: any) => requestClient.get('/sys/tenant/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/tenant/${id}`),
  create: (data: any) => requestClient.post('/sys/tenant', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/tenant/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/tenant/${id}`),
};

/**
 * ================= SysDept API =================
 */
export const sysDeptApi = {
  getList: (params?: any) => requestClient.get('/sys/dept/list', { params }),
  getTree: (params?: any) => requestClient.get('/sys/dept/tree', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/dept/${id}`),
  create: (data: any) => requestClient.post('/sys/dept', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/dept/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/dept/${id}`),
};

/**
 * ================= SysPost API =================
 */
export const sysPostApi = {
  getList: (params?: any) => requestClient.get('/sys/post/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/post/${id}`),
  create: (data: any) => requestClient.post('/sys/post', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/post/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/post/${id}`),
};

/**
 * ================= SysRole API =================
 */
export const sysRoleApi = {
  getList: (params?: any) => requestClient.get('/sys/role/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/role/${id}`),
  create: (data: any) => requestClient.post('/sys/role', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/role/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/role/${id}`),
  /** 获取角色已分配的菜单ID列表 */
  getRoleMenus: (id: number | string) =>
    requestClient.get(`/sys/role/${id}/menus`),
  /** 保存角色的菜单权限分配 */
  saveRoleMenus: (id: number | string, menuIds: number[]) =>
    requestClient.put(`/sys/role/${id}/menus`, { menuIds }),
};

/**
 * ================= SysMenu API =================
 */
export const sysMenuApi = {
  getList: (params?: any) => requestClient.get('/sys/menu/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/menu/${id}`),
  create: (data: any) => requestClient.post('/sys/menu', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/menu/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/menu/${id}`),
};

/**
 * ================= SysUser API =================
 */
export const sysUserApi = {
  getList: (params?: any) => requestClient.get('/sys/user/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/user/${id}`),
  create: (data: any) => requestClient.post('/sys/user', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/user/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/user/${id}`),
};

/**
 * ================= SysOperLog API =================
 */
export const sysOperLogApi = {
  getList: (params?: any) => requestClient.get('/sys/operlog/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/operlog/${id}`),
  clean: () => requestClient.delete('/sys/operlog/clean'),
  remove: (id: number | string) => requestClient.delete(`/sys/operlog/${id}`),
};

/**
 * ================= SysLogininfor API =================
 */
export const sysLogininforApi = {
  getList: (params?: any) =>
    requestClient.get('/sys/logininfor/list', { params }),
  clean: () => requestClient.delete('/sys/logininfor/clean'),
  remove: (id: number | string) =>
    requestClient.delete(`/sys/logininfor/${id}`),
};

/**
 * ================= SysJob API =================
 */
export const sysJobApi = {
  getList: (params?: any) => requestClient.get('/sys/job/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/job/${id}`),
  create: (data: any) => requestClient.post('/sys/job', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/job/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/job/${id}`),
};

/**
 * ================= SysDocCode API =================
 */
export const sysDocCodeApi = {
  getList: (params?: any) =>
    requestClient.get('/sys/doc-code/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/doc-code/${id}`),
  create: (data: any) => requestClient.post('/sys/doc-code', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/doc-code/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/doc-code/${id}`),
};

/**
 * ================= SysFormDesign API =================
 */
export const sysFormDesignApi = {
  getList: (params?: any) =>
    requestClient.get('/sys/form-design/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys/form-design/${id}`),
  create: (data: any) => requestClient.post('/sys/form-design', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/form-design/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/sys/form-design/${id}`),
};

export const sysPageMetaApi = {
  getList: (params?: any) =>
    requestClient.get('/sys/form-design/page-meta/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/sys/form-design/page-meta/${id}`),
  create: (data: any) => requestClient.post('/sys/form-design/page-meta', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/form-design/page-meta/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/sys/form-design/page-meta/${id}`),
};

export const sysPageSchemaApi = {
  getTemplateList: (params?: any) =>
    requestClient.get('/sys/page-schema/template/list', { params }),
  getTemplateById: (id: number | string) =>
    requestClient.get(`/sys/page-schema/template/${id}`),
  createTemplate: (data: any) => requestClient.post('/sys/page-schema/template', data),
  updateTemplate: (id: number | string, data: any) =>
    requestClient.put(`/sys/page-schema/template/${id}`, data),
  removeTemplate: (id: number | string) =>
    requestClient.delete(`/sys/page-schema/template/${id}`),
  publishTemplate: (id: number | string) =>
    requestClient.post(`/sys/page-schema/template/${id}/publish`, {}),
  rollbackTemplate: (id: number | string, logId: number | string) =>
    requestClient.post(`/sys/page-schema/template/${id}/rollback/${logId}`, {}),
  getTemplateLogs: (id: number | string) =>
    requestClient.get(`/sys/page-schema/template/${id}/logs`),
  getTenantOverride: (pageCode: string, params?: any) =>
    requestClient.get(`/sys/page-schema/tenant/${pageCode}`, { params }),
  saveTenantOverride: (pageCode: string, data: any) =>
    requestClient.put(`/sys/page-schema/tenant/${pageCode}`, data),
  publishTenantOverride: (pageCode: string, data?: any) =>
    requestClient.post(`/sys/page-schema/tenant/${pageCode}/publish`, data || {}),
  rollbackTenantOverride: (pageCode: string, logId: number | string, data?: any) =>
    requestClient.post(`/sys/page-schema/tenant/${pageCode}/rollback/${logId}`, data || {}),
  getTenantLogs: (pageCode: string, params?: any) =>
    requestClient.get(`/sys/page-schema/tenant/${pageCode}/logs`, { params }),
  getUserPreference: (pageCode: string, params?: any) =>
    requestClient.get(`/sys/page-schema/user/${pageCode}`, { params }),
  saveUserPreference: (pageCode: string, data: any) =>
    requestClient.put(`/sys/page-schema/user/${pageCode}`, data),
  publishUserPreference: (pageCode: string, data?: any) =>
    requestClient.post(`/sys/page-schema/user/${pageCode}/publish`, data || {}),
  rollbackUserPreference: (pageCode: string, logId: number | string, data?: any) =>
    requestClient.post(`/sys/page-schema/user/${pageCode}/rollback/${logId}`, data || {}),
  getUserLogs: (pageCode: string, params?: any) =>
    requestClient.get(`/sys/page-schema/user/${pageCode}/logs`, { params }),
  getRuntime: (pageCode: string, params?: any) =>
    requestClient.get(`/sys/page-schema/runtime/${pageCode}`, { params }),
};

/**
 * ================= SysApprovalProcess API =================
 */
export const sysApprovalProcessApi = {
  getList: (params?: any) =>
    requestClient.get('/sys/approval-process/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/sys/approval-process/${id}`),
  create: (data: any) => requestClient.post('/sys/approval-process', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/approval-process/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/sys/approval-process/${id}`),
};

/**
 * ================= SysPrintDesign API =================
 */
export const sysPrintDesignApi = {
  getList: (params?: any) =>
    requestClient.get('/sys/print-design/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/sys/print-design/${id}`),
  create: (data: any) => requestClient.post('/sys/print-design', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/print-design/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/sys/print-design/${id}`),
};

/**
 * ================= SysFormData API =================
 */
export const sysFormDataApi = {
  getList: (params?: any) =>
    requestClient.get('/sys-form-data/list', { params }),
  getById: (id: number | string) => requestClient.get(`/sys-form-data/${id}`),
  create: (data: any) => requestClient.post('/sys-form-data', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys-form-data/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys-form-data/${id}`),
};

/**
 * ================= SysGen API =================
 */
export const sysGenApi = {
  getDbTables: (params?: any) =>
    requestClient.get('/sys-gen/db/tables', { params }),
  importTables: (tables: string[]) =>
    requestClient.post('/sys-gen/import', { tables }),
  getList: (params?: any) => requestClient.get('/sys-gen/list', { params }),
  getDetail: (id: number | string) => requestClient.get(`/sys-gen/${id}`),
  updateConfig: (data: any) => requestClient.put('/sys-gen', data),
  remove: (id: number | string) => requestClient.delete(`/sys-gen/${id}`),
  syncTable: (id: number | string) => requestClient.post(`/sys-gen/sync/${id}`),
  previewCode: (id: number | string) =>
    requestClient.get(`/sys-gen/preview/${id}`),
  generateCode: (id: number | string) =>
    requestClient.post(`/sys-gen/generate/${id}`),
};

export const sysDashboardApi = {
  getStatistics: () => requestClient.get('/sys-dashboard/statistics'),
};

/**
 * ================= SysDictType API =================
 */
export const sysDictTypeApi = {
  getList: (params?: any) =>
    requestClient.get('/sys/dict/type/list', { params }),
  create: (data: any) => requestClient.post('/sys/dict/type', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/dict/type/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/dict/type/${id}`),
};

/**
 * ================= SysDictData API =================
 */
export const sysDictDataApi = {
  getList: (params?: any) =>
    requestClient.get('/sys/dict/data/list', { params }),
  getByType: (dictType: string) =>
    requestClient.get(`/sys/dict/data/type/${dictType}`),
  bootstrapFinanceBase: () =>
    requestClient.post('/sys/dict/bootstrap/finance-base'),
  create: (data: any) => requestClient.post('/sys/dict/data', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/sys/dict/data/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/sys/dict/data/${id}`),
};

/**
 * ================= SysConfig API =================
 */
export const sysConfigApi = {
  getGlobal: () => requestClient.get('/sys/config/global'),
  saveGlobal: (data: Record<string, string>) =>
    requestClient.post('/sys/config/save', data),
  getGroup: (group: string) => requestClient.get(`/sys/config/group/${group}`),
  saveGroup: (group: string, data: Record<string, string>) =>
    requestClient.post(`/sys/config/group/${group}`, data),
};

/**
 * ================= ResearchProject API =================
 */
export const researchProjectApi = {
  getList: (params?: any) =>
    requestClient.get('/research/project/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/research/project/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/research/project/${id}/history`),
  create: (data: any) => requestClient.post('/research/project', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/research/project/${id}`, data),
  submit: (id: number | string) =>
    requestClient.post(`/research/project/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/research/project/${id}/withdraw`),
  remove: (id: number | string) =>
    requestClient.delete(`/research/project/${id}`),
};
/**
 * ================= ResearchFundArrival API =================
 */
export const researchFundArrivalApi = {
  getList: (params?: any) =>
    requestClient.get('/research/fund-arrival/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/research/fund-arrival/${id}`),
  create: (data: any) => requestClient.post('/research/fund-arrival', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/research/fund-arrival/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/research/fund-arrival/${id}`),
};

/**
 * ================= ResearchFundClaim API =================
 */
export const researchFundClaimApi = {
  getList: (params?: any) =>
    requestClient.get('/research/fund-claim/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/research/fund-claim/${id}`),
  create: (data: any) => requestClient.post('/research/fund-claim', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/research/fund-claim/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/research/fund-claim/${id}`),
};

/**
 * ================= ResearchIndicator API =================
 */
export const researchIndicatorApi = {
  getList: (params?: any) =>
    requestClient.get('/research/indicator/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/research/indicator/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/research/indicator/${id}/history`),
  create: (data: any) => requestClient.post('/research/indicator', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/research/indicator/${id}`, data),
  submit: (id: number | string) =>
    requestClient.post(`/research/indicator/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/research/indicator/${id}/withdraw`),
  remove: (id: number | string) =>
    requestClient.delete(`/research/indicator/${id}`),
};

/**
 * ================= ResearchExpenseScope API =================
 */
export const researchExpenseScopeApi = {
  getList: (params?: any) =>
    requestClient.get('/research/expense-scope/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/research/expense-scope/${id}`),
  create: (data: any) => requestClient.post('/research/expense-scope', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/research/expense-scope/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/research/expense-scope/${id}`),
};

/**
 * ================= ResearchScopeAdjust API =================
 */
export const researchScopeAdjustApi = {
  getList: (params?: any) =>
    requestClient.get('/research/scope-adjust/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/research/scope-adjust/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/research/scope-adjust/${id}/history`),
  create: (data: any) => requestClient.post('/research/scope-adjust', data),
  submit: (id: number | string) =>
    requestClient.post(`/research/scope-adjust/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/research/scope-adjust/${id}/withdraw`),
  update: (id: number | string, data: any) =>
    requestClient.put(`/research/scope-adjust/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/research/scope-adjust/${id}`),
};

/**
 * ================= Contract API =================
 */
export const contractApi = {
  getList: (params?: any) => requestClient.get('/contract/list', { params }),
  getById: (id: number | string) => requestClient.get(`/contract/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/contract/${id}/history`),
  create: (data: any) => requestClient.post('/contract', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/contract/${id}`, data),
  submit: (id: number | string) => requestClient.post(`/contract/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/contract/${id}/withdraw`),
  remove: (id: number | string) => requestClient.delete(`/contract/${id}`),
};

/**
 * ================= ContractReceipt API =================
 */
export const contractReceiptApi = {
  getList: (params?: any) =>
    requestClient.get('/contract-receipt/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/contract-receipt/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/contract-receipt/${id}/history`),
  create: (data: any) => requestClient.post('/contract-receipt', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/contract-receipt/${id}`, data),
  submit: (id: number | string) =>
    requestClient.post(`/contract-receipt/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/contract-receipt/${id}/withdraw`),
  remove: (id: number | string) =>
    requestClient.delete(`/contract-receipt/${id}`),
};

/**
 * ================= ContractRelease API =================
 */
export const contractReleaseApi = {
  getList: (params?: any) =>
    requestClient.get('/contract-release/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/contract-release/${id}`),
  create: (data: any) => requestClient.post('/contract-release', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/contract-release/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/contract-release/${id}`),
};

/**
 * ================= ContractEvaluation API =================
 */
export const contractEvaluationApi = {
  getList: (params?: any) =>
    requestClient.get('/contract-evaluation/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/contract-evaluation/${id}`),
  create: (data: any) => requestClient.post('/contract-evaluation', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/contract-evaluation/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/contract-evaluation/${id}`),
};

/**
 * ================= ExpenseClaim API =================
 */
export const expenseClaimApi = {
  getList: (params?: any) =>
    requestClient.get('/expense-claim/list', { params }),
  getById: (id: number | string) => requestClient.get(`/expense-claim/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/expense-claim/${id}/history`),
  create: (data: any) => requestClient.post('/expense-claim', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/expense-claim/${id}`, data),
  submit: (id: number | string) =>
    requestClient.post(`/expense-claim/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/expense-claim/${id}/withdraw`),
  remove: (id: number | string) => requestClient.delete(`/expense-claim/${id}`),
};

/**
 * ================= ExpenseClaimDetail API =================
 */
export const expenseClaimDetailApi = {
  getList: (params?: any) =>
    requestClient.get('/expense-claim-detail/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/expense-claim-detail/${id}`),
  create: (data: any) => requestClient.post('/expense-claim-detail', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/expense-claim-detail/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/expense-claim-detail/${id}`),
};

/**
 * ================= ExpensePayee API =================
 */
export const expensePayeeApi = {
  getList: (params?: any) =>
    requestClient.get('/expense-payee/list', { params }),
  getById: (id: number | string) => requestClient.get(`/expense-payee/${id}`),
  create: (data: any) => requestClient.post('/expense-payee', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/expense-payee/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/expense-payee/${id}`),
};

/**
 * ================= ExpensePayer API =================
 */
export const expensePayerApi = {
  getList: (params?: any) =>
    requestClient.get('/expense-payer/list', { params }),
  getById: (id: number | string) => requestClient.get(`/expense-payer/${id}`),
  create: (data: any) => requestClient.post('/expense-payer', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/expense-payer/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/expense-payer/${id}`),
};

/**
 * ================= PaymentMethod API =================
 */
export const paymentMethodApi = {
  getList: (params?: any) =>
    requestClient.get('/payment-method/list', { params }),
  getById: (id: number | string) => requestClient.get(`/payment-method/${id}`),
  create: (data: any) => requestClient.post('/payment-method', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/payment-method/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/payment-method/${id}`),
};

/**
 * ================= EngineeringProject API =================
 */
export const engineeringProjectApi = {
  getList: (params?: any) =>
    requestClient.get('/engineering-project/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/engineering-project/${id}`),
  create: (data: any) => requestClient.post('/engineering-project', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/engineering-project/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/engineering-project/${id}`),
};

/**
 * ================= Contractor API =================
 */
export const contractorApi = {
  getList: (params?: any) => requestClient.get('/contractor/list', { params }),
  getById: (id: number | string) => requestClient.get(`/contractor/${id}`),
  create: (data: any) => requestClient.post('/contractor', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/contractor/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/contractor/${id}`),
};

/**
 * ================= BidNotice API =================
 */
export const bidNoticeApi = {
  getList: (params?: any) => requestClient.get('/bid-notice/list', { params }),
  getById: (id: number | string) => requestClient.get(`/bid-notice/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/bid-notice/${id}/history`),
  create: (data: any) => requestClient.post('/bid-notice', data),
  submit: (id: number | string) =>
    requestClient.post(`/bid-notice/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/bid-notice/${id}/withdraw`),
  update: (id: number | string, data: any) =>
    requestClient.put(`/bid-notice/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/bid-notice/${id}`),
};

/**
 * ================= Expert API =================
 */
export const expertApi = {
  getList: (params?: any) => requestClient.get('/expert/list', { params }),
  getById: (id: number | string) => requestClient.get(`/expert/${id}`),
  create: (data: any) => requestClient.post('/expert', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/expert/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/expert/${id}`),
};

/**
 * ================= ProcurementApply API =================
 */
export const procurementApplyApi = {
  getList: (params?: any) =>
    requestClient.get('/procurement-apply/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/procurement-apply/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/procurement-apply/${id}/history`),
  create: (data: any) => requestClient.post('/procurement-apply', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/procurement-apply/${id}`, data),
  submit: (id: number | string) =>
    requestClient.post(`/procurement-apply/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/procurement-apply/${id}/withdraw`),
  remove: (id: number | string) =>
    requestClient.delete(`/procurement-apply/${id}`),
};

/**
 * ================= ProcurementResult API =================
 */
export const procurementResultApi = {
  getList: (params?: any) =>
    requestClient.get('/procurement-result/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/procurement-result/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/procurement-result/${id}/history`),
  create: (data: any) => requestClient.post('/procurement-result', data),
  submit: (id: number | string) =>
    requestClient.post(`/procurement-result/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/procurement-result/${id}/withdraw`),
  update: (id: number | string, data: any) =>
    requestClient.put(`/procurement-result/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/procurement-result/${id}`),
};

/**
 * ================= ProcurementRelease API =================
 */
export const procurementReleaseApi = {
  getList: (params?: any) =>
    requestClient.get('/procurement-release/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/procurement-release/${id}`),
  create: (data: any) => requestClient.post('/procurement-release', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/procurement-release/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/procurement-release/${id}`),
};

/**
 * ================= Supplier API =================
 */
export const supplierApi = {
  getList: (params?: any) => requestClient.get('/supplier/list', { params }),
  getById: (id: number | string) => requestClient.get(`/supplier/${id}`),
  create: (data: any) => requestClient.post('/supplier', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/supplier/${id}`, data),
  remove: (id: number | string) => requestClient.delete(`/supplier/${id}`),
};

// ============================================================
// 指标管理模块 API
// ============================================================

/**
 * ================= ProjectLevel1 API（一级项目）=================
 */
export const projectLevel1Api = {
  getList: (params?: any) =>
    requestClient.get('/project-level1/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/project-level1/${id}`),
  create: (data: any) => requestClient.post('/project-level1', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/project-level1/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/project-level1/${id}`),
};

/**
 * ================= ProjectLevel2 API（二级项目）=================
 */
export const projectLevel2Api = {
  getList: (params?: any) =>
    requestClient.get('/project-level2/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/project-level2/${id}`),
  create: (data: any) => requestClient.post('/project-level2', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/project-level2/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/project-level2/${id}`),
};

/**
 * ================= BudgetIndicator API（部门指标）=================
 */
export const budgetIndicatorApi = {
  getList: (params?: any) =>
    requestClient.get('/budget-indicator/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/budget-indicator/${id}`),
  create: (data: any) => requestClient.post('/budget-indicator', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/budget-indicator/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/budget-indicator/${id}`),
};

/**
 * ================= IndicatorAuth API（指标授权）=================
 */
export const indicatorAuthApi = {
  getList: (params?: any) =>
    requestClient.get('/indicator-auth/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/indicator-auth/${id}`),
  create: (data: any) => requestClient.post('/indicator-auth', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/indicator-auth/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/indicator-auth/${id}`),
};

/**
 * ================= IndicatorAdjust API（指标调整）=================
 */
export const indicatorAdjustApi = {
  getList: (params?: any) =>
    requestClient.get('/indicator-adjust/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/indicator-adjust/${id}`),
  create: (data: any) => requestClient.post('/indicator-adjust', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/indicator-adjust/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/indicator-adjust/${id}`),
};

/**
 * ================= IndicatorTransfer API（指标调剂）=================
 */
export const indicatorTransferApi = {
  getList: (params?: any) =>
    requestClient.get('/indicator-transfer/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/indicator-transfer/${id}`),
  create: (data: any) => requestClient.post('/indicator-transfer', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/indicator-transfer/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/indicator-transfer/${id}`),
};

/**
 * ================= AuthAdjustApply API（授权调整申请）=================
 */
export const authAdjustApplyApi = {
  getList: (params?: any) =>
    requestClient.get('/auth-adjust-apply/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/auth-adjust-apply/${id}`),
  getHistory: (id: number | string) =>
    requestClient.get(`/auth-adjust-apply/${id}/history`),
  create: (data: any) => requestClient.post('/auth-adjust-apply', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/auth-adjust-apply/${id}`, data),
  submit: (id: number | string) =>
    requestClient.post(`/auth-adjust-apply/${id}/submit`),
  withdraw: (id: number | string) =>
    requestClient.post(`/auth-adjust-apply/${id}/withdraw`),
  remove: (id: number | string) =>
    requestClient.delete(`/auth-adjust-apply/${id}`),
};

/**
 * ================= IndicatorTemplate API（指标模板）=================
 */
export const indicatorTemplateApi = {
  getList: (params?: any) =>
    requestClient.get('/indicator-template/list', { params }),
  getById: (id: number | string) =>
    requestClient.get(`/indicator-template/${id}`),
  create: (data: any) => requestClient.post('/indicator-template', data),
  update: (id: number | string, data: any) =>
    requestClient.put(`/indicator-template/${id}`, data),
  remove: (id: number | string) =>
    requestClient.delete(`/indicator-template/${id}`),
};
