export default {
  trans: true,
  key: 'system.views',
  data: {
    dictGroup: {
      title: {
        dictCode: '字典编码',
        dictName: '字典名称',
      },
      validate: {
        dictCode: '请输入字典编码',
        dictName: '请输入字典名称',
      },
    },
    dictItem: {
      title: {
        dictCode: '字典编码',
        dictItemCode: '字典项编码',
        dictItemName: '字典项名称',
      },
      validate: {
        dictCode: '请输入字典编码',
        dictItemCode: '请输入字典项编码',
        dictItemName: '请输入字典项名称',
      },
      rules: {
        dictItemCode_NOT_EMPTY: '字典项编码不能为空',
        dictItemName_NOT_EMPTY: '字典项名称不能为空',
      },
      message: {
        dictCodeNull: '请先选择字典',
      },
    },
  },
};
