/**
 *  国际化信息
 */
export default {
  trans: true,
  key: 'system.views.auth.accessSecret',
  data: {
    title: {
      accessKey: 'Access key',
      secretKey: 'Secret key',
      expireDate: '过期时间',
      accessIp: '授权IP或域名',
      createBy: 'createBy',
      updateBy: 'updateBy',
      tenantId: '所属租户',
    },
    validate: {
      accessKey: '请输入Access key',
      secretKey: '请输入Secret key',
      expireDate: '请输入过期时间',
      accessIp: '请输入授权IP或域名，以逗号分隔',
    },
    rules: {},
    search: {
      accessKey: '请输入Access key',
      secretKey: '请输入Secret key',
    },
  },
};
