/**
 * 租户表 国际化信息
 */
export default {
  trans: true,
  key: 'system.views.tenant',
  data: {
    title: {
      id: 'id',
      tenantCode: '租户编号',
      tenantName: '租户名字',
      contacts: '联系人',
      contactPhone: '联系人电话',
      domain: '域名',
      availableUserNum: '可用人数',
      address: '地址',
      logoId: 'LOGO',
      startTime: '开始时间',
      endTime: '过期时间',
      validatedTime: '有效时间',
    },
    validate: {
      id: '请输入',
      tenantCode: '请输入租户编号',
      tenantName: '请输入租户名字',
      contacts: '请输入联系人',
      contactPhone: '请输入联系人电话',
      domain: '请输入域名',
      availableUserNum: '请输入可用人数，-1不限制',
      address: '请输入地址',
      logoId: '请输入LOGO',
      startTime: '请输入开始时间',
      endTime: '请输入过期时间',
    },
    rules: {},
    search: {
      tenantCode: '请输入租户编号',
      tenantName: '请输入租户名字',
    },
  },
};
