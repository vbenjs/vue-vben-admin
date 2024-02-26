export default {
  generator: {
    views: {
      database: {
        common: {
          chooseTemplate: '选择模板',
        },
        table: {
          connectionName: '连接名称',
          databaseName: '数据库名称',
          type: '类型',
          project: '项目',
          url: 'URL',
          username: '用户名',
          tableSchema: 'TableSchema',
          password: '密码',
        },
        button: {
          testConnected: '测试连接',
          createDic: '生成数据库字典',
        },
        validate: {
          type: '请选择数据库类型',
          connectionName: '请输入连接名称',
          databaseName: '请输入数据库名称',
          project: '请输入项目',
          url: '请输入URL',
          username: '请输入用户名',
          password: '请输入密码',
          template: '请选择模板',
        },
        message: {
          deleteOwn: '只能删除自己创建的数据库连接',
          connectSuccess: '数据库连接成功',
          connectFail: '数据库连接失败',
        },
      },
    },
  },
};
