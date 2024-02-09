/**
 * 文件存储器配置 国际化信息
 */
export default {
  trans: true,
  key: 'smart.file.storage',
  data: {
    title: {
      id: 'id',
      storageCode: 'Storage code',
      storageName: 'Storage name',
      storageType: 'Storage type',
      defaultStorage: 'Default',
      storageConfig: 'config',
      basePath: 'Bash path',
      endpoint: 'End point',
      accessKey: 'Access key',
      secretKey: 'Secret key',
      bucketName: 'Bucket name',
      host: 'Host',
      port: 'Port',
      username: 'Username',
      password: 'Password',
      privateKey: 'Private key',
      region: 'Region',
      url: 'URL',
      useHttps: 'Use https',
    },
    validate: {
      storageCode: 'Please enter storage code',
      storageName: 'Please enter storage name',
      storageType: 'Please select storage type',
      defaultStorage: 'Please enter storage default',
      storageConfig: 'Please enter storage config',
    },
    message: {
      setDefault:
        'Only one default memory can be set. Are you sure you want to set it as the default memory?',
    },
    rules: {},
    search: {
      storageCode: 'Please enter storage code',
      storageName: 'Please enter storage name',
      storageType: 'Please select storage type',
    },
    button: {
      setDefault: 'Set default',
    },
  },
};
