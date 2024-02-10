/**
 * 租户表 国际化信息
 */
export default {
  trans: true,
  key: 'system.views.tenant',
  data: {
    title: {
      id: 'id',
      tenantCode: 'Tenant code',
      tenantName: 'Tenant name',
      contacts: 'Contacts',
      contactPhone: 'Contact phone',
      domain: 'domain',
      availableUserNum: 'Available user num',
      address: 'Address',
      logoId: 'LOGO',
      startTime: 'Start time',
      endTime: 'End time',
      validatedTime: 'Validated time',
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
