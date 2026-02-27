import { requestClient } from '#/api/request';

/**
 * ================= SysTenant API =================
 */
export const sysTenantApi = {
  getList: (params?: any) => requestClient.get('/sys/tenant/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/tenant/${id}`),
  create: (data: any) => requestClient.post('/sys/tenant', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/tenant/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/tenant/${id}`),
};

/**
 * ================= SysDept API =================
 */
export const sysDeptApi = {
  getList: (params?: any) => requestClient.get('/sys/dept/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/dept/${id}`),
  create: (data: any) => requestClient.post('/sys/dept', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/dept/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/dept/${id}`),
};

/**
 * ================= SysPost API =================
 */
export const sysPostApi = {
  getList: (params?: any) => requestClient.get('/sys/post/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/post/${id}`),
  create: (data: any) => requestClient.post('/sys/post', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/post/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/post/${id}`),
};

/**
 * ================= SysRole API =================
 */
export const sysRoleApi = {
  getList: (params?: any) => requestClient.get('/sys/role/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/role/${id}`),
  create: (data: any) => requestClient.post('/sys/role', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/role/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/role/${id}`),
};

/**
 * ================= SysMenu API =================
 */
export const sysMenuApi = {
  getList: (params?: any) => requestClient.get('/sys/menu/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/menu/${id}`),
  create: (data: any) => requestClient.post('/sys/menu', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/menu/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/menu/${id}`),
};

/**
 * ================= SysUser API =================
 */
export const sysUserApi = {
  getList: (params?: any) => requestClient.get('/sys/user/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/user/${id}`),
  create: (data: any) => requestClient.post('/sys/user', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/user/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/user/${id}`),
};

/**
 * ================= SysOperLog API =================
 */
export const sysOperLogApi = {
  getList: (params?: any) => requestClient.get('/sys/operlog/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/operlog/${id}`),
  clean: () => requestClient.delete('/sys/operlog/clean'),
  remove: (id: string | number) => requestClient.delete(`/sys/operlog/${id}`),
};

/**
 * ================= SysLogininfor API =================
 */
export const sysLogininforApi = {
  getList: (params?: any) => requestClient.get('/sys/logininfor/list', { params }),
  clean: () => requestClient.delete('/sys/logininfor/clean'),
  remove: (id: string | number) => requestClient.delete(`/sys/logininfor/${id}`),
};

/**
 * ================= SysJob API =================
 */
export const sysJobApi = {
  getList: (params?: any) => requestClient.get('/sys/job/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/job/${id}`),
  create: (data: any) => requestClient.post('/sys/job', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/job/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/job/${id}`),
};

/**
 * ================= SysDocCode API =================
 */
export const sysDocCodeApi = {
  getList: (params?: any) => requestClient.get('/sys/doc-code/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/doc-code/${id}`),
  create: (data: any) => requestClient.post('/sys/doc-code', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/doc-code/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/doc-code/${id}`),
};

/**
 * ================= SysFormDesign API =================
 */
export const sysFormDesignApi = {
  getList: (params?: any) => requestClient.get('/sys/form-design/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/form-design/${id}`),
  create: (data: any) => requestClient.post('/sys/form-design', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/form-design/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/form-design/${id}`),
};

/**
 * ================= SysApprovalProcess API =================
 */
export const sysApprovalProcessApi = {
  getList: (params?: any) => requestClient.get('/sys/approval-process/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/approval-process/${id}`),
  create: (data: any) => requestClient.post('/sys/approval-process', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/approval-process/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/approval-process/${id}`),
};

/**
 * ================= SysPrintDesign API =================
 */
export const sysPrintDesignApi = {
  getList: (params?: any) => requestClient.get('/sys/print-design/list', { params }),
  getById: (id: string | number) => requestClient.get(`/sys/print-design/${id}`),
  create: (data: any) => requestClient.post('/sys/print-design', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/print-design/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/print-design/${id}`),
};

/**
 * ================= SysDictType API =================
 */
export const sysDictTypeApi = {
  getList: (params?: any) => requestClient.get('/sys/dict/type/list', { params }),
  create: (data: any) => requestClient.post('/sys/dict/type', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/dict/type/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/dict/type/${id}`),
};

/**
 * ================= SysDictData API =================
 */
export const sysDictDataApi = {
  getList: (params?: any) => requestClient.get('/sys/dict/data/list', { params }),
  create: (data: any) => requestClient.post('/sys/dict/data', data),
  update: (id: string | number, data: any) => requestClient.put(`/sys/dict/data/${id}`, data),
  remove: (id: string | number) => requestClient.delete(`/sys/dict/data/${id}`),
};

