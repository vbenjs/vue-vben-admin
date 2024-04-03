/**
 * kettle资源库 国际化信息
 */
export default {
  trans: true,
  key: 'smart.kettle.repository',
  data: {
    title: {
      id: 'id',
      repositoryCode: '编码',
      repositoryName: '名称',
      type: '类型',
      properties: '资源库参数',
      defaultYn: '是否默认',
      createBy: 'createBy',
      updateBy: 'updateBy',
    },
    validate: {
      id: '请输入id',
      repositoryCode: '请输入编码',
      repositoryName: '请输入名称',
      type: '请输入类型',
      defaultYn: '请输入是否默认',
      properties: '请输入资源库参数',
    },
    rules: {},
    search: {
      repositoryCode: '请输入编码',
      repositoryName: '请输入名称',
      type: '请输入类型',
    },
    form: {
      properties: {
        type: '数据库类型',
        access: '连接方式',
        name: '连接名称',
        host: '主机名称',
        db: '数据库名称',
        port: '端口',
        dbUser: '数据库用户',
        dbPassword: '数据库密码',
        id: '资源库ID',
        repositoryName: '资源库名称',
        description: '资源库描述',
        resUser: '资源库用户',
        resPassword: '资源库密码',
      },
    },
  },
};
