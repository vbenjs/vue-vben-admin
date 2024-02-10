export default {
  generator: {
    views: {
      database: {
        common: {
          chooseTemplate: 'Select template',
        },
        table: {
          connectionName: 'Connection name',
          databaseName: 'DB name',
          type: 'Type',
          project: 'Project',
          url: 'URL',
          username: 'Username',
          tableSchema: 'Table schema',
          password: 'Password',
        },
        button: {
          testConnected: 'Test connection',
          createDic: 'Generate database dic',
        },
        validate: {
          type: 'Please select database type',
          connectionName: 'Please enter connection name',
          databaseName: 'Please enter database name',
          project: 'Please enter database',
          url: 'Please enter URL',
          username: 'Please enter username',
          password: 'Please enter password',
          template: 'Please select template',
        },
        message: {
          deleteOwn: 'You can only delete database connections that you have created',
          connectSuccess: 'Database connection succeeded',
          connectFail: 'Database connection failed',
        },
      },
    },
  },
};
