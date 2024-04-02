/**
 * 租户表 国际化信息
 */
export default {
  trans: true,
  key: 'system.views.tenant',
  data: {
    title: {
      tenantCode: 'Tenant code',
      tenantName: 'Tenant name',
      tenantShortName: 'Short name',
      type: 'Type',
      contacts: 'Contacts',
      contactPhone: 'Contact phone',
      email: 'Email',
      isolationStrategy: 'Isolation strategy',
      industry: 'Industry',
      domain: 'domain',
      availableUserNum: 'Available user num',
      address: 'Address',
      logoId: 'LOGO',
      effectTime: 'Effect time',
      expireTime: 'Expire time',
    },
    validate: {
      tenantCode: 'Please enter the tenant code',
      tenantName: 'Please enter the tenant name',
      contacts: 'Please enter the contacts',
      contactPhone: 'Please enter the contact phone',
      domain: 'Please enter the tenant domain',
      availableUserNum: 'Please enter available user num',
      address: 'Please enter the address',
      logoId: 'Please enter the logo',
      startTime: 'Please enter the start time',
      endTime: 'Please enter the end time',
    },
    rules: {},
    search: {
      tenantCode: 'Please enter the tenant code',
      tenantName: 'Please enter the tenant name',
    },
  },
};
