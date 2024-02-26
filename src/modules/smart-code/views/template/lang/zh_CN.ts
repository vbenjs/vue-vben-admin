export default {
  generator: {
    views: {
      template: {
        label: {
          templateType: {
            templateCode: '代码模板',
            templateDbDict: '数据库字典模板',
          },
        },
        title: {
          userGroup: '用户组',
          templateGroup: '模板分组',
          seq: '序号',
        },
        table: {
          name: '名称',
          templateType: '模板类型',
          language: '语言',
          remark: '备注',
          filenameSuffix: '文件名后缀',
        },
        notice: {
          onlyDeleteMy: '只能删除自己创建的模板',
          choseGroup: '请先选择模板分组',
        },
        validate: {
          templateType: '请输入模板类型',
          name: '请输入模板名称',
          remark: '请输入备注',
          seq: '请输入序号',
          templateGroup: '请输入模板分组',
        },
      },
    },
  },
};
