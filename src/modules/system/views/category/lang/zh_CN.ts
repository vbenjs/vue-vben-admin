/**
 * 分类字段 国际化信息
 */
export default {
  trans: true,
  key: 'system.views.category',
  data: {
    title: {
      categoryCode: '分类编码',
      categoryName: '分类名称',
      createBy: 'createBy',
      updateBy: 'updateBy',
      parentName: '上级',
    },
    validate: {
      id: '请输入',
      parentId: '请输入',
      categoryCode: '请输入分类编码',
      categoryName: '请输入分类名称',
    },
    rules: {},
    search: {
      categoryCode: '请输入分类编码',
      categoryName: '请输入分类名称',
    },
    button: {
      addChild: '添加下级',
    },
  },
};
