/**
 * 文件存储器配置 国际化信息
 */
export default {
  trans: true,
  key: 'smart.file.storage',
  data: {
    title: {
      id: 'id',
      storageCode: '存储器编码',
      storageName: '存储器名称',
      storageType: '存储器类型',
      defaultStorage: '默认存储器',
      storageConfig: '存储器配置信息',
      basePath: '基础路径',
      endpoint: 'Endpoint',
      accessKey: 'AccessKey',
      secretKey: 'SecretKey',
      bucketName: 'BucketName',
      host: '主机地址',
      port: '端口',
      username: '用户名',
      password: '密码',
      privateKey: '私钥',
      region: '区域',
      url: 'URL',
      useHttps: '启用https',
    },
    validate: {
      storageCode: '请输入存储器编码',
      storageName: '请输入存储器名称',
      storageType: '请输入存储器类型',
      defaultStorage: '请输入是否是默认存储器',
      storageConfig: '请输入存储器配置信息',
    },
    message: {
      setDefault: '只能设置一个默认存储器，确定要设为默认存储器吗？',
    },
    rules: {},
    search: {
      storageCode: '请输入存储器编码',
      storageName: '请输入存储器名称',
      storageType: '请输入存储器类型',
    },
    button: {
      setDefault: '设为默认',
    },
  },
};
