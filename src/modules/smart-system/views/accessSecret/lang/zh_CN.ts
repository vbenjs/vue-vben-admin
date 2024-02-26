/**
 *  国际化信息
 */
export default {
  trans: true,
  key: 'system.views.auth.acccessSecret',
  data: {
    title: {
      accessKey: 'Access key',
      secretKey: 'Secret key',
      expireDate: '过期时间',
      accessIp: '授权IP或域名',
      createBy: 'createBy',
      updateBy: 'updateBy',
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
