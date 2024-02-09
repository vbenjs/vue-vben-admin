/**
 * 秘钥管理 国际化信息
 */
export default {
  trans: true,
  key: 'smart.auth.secret',
  data: {
    title: {
      keyName: '秘钥名称',
      fileStorageId: '文件存储器ID',
      alias: '私钥别称',
      storePassword: '密钥库密码',
      keyPassword: '私钥密码',
      publicKeyFile: '公钥',
      privateKeyFile: '私钥',
    },
    validate: {
      keyName: '请输入秘钥名称',
      fileStorageId: '请输入文件存储器ID',
      storePassword: '请输入密钥库密码',
      keyPassword: '请输入私钥密码',
      alias: '请输入私钥别称',
      publicKeyFileId: '请输入公钥文件ID',
      privateKeyFileId: '请输入私钥文件ID',
    },
    rules: {},
    search: {
      keyName: '请输入秘钥名称',
    },
  },
};
