const ResultUtil = require('../_util/resultUtil');
const Mock = require('mockjs');

const wokbProd = Mock.mock([
  {
    amount: '@integer(90,100)',
    type: '成品总是',
  },
  {
    amount: '@integer(0,50)',
    type: '未发布',
  },
  {
    amount: '@integer(0,50)',
    type: '发布中',
  },
  {
    amount: '@integer(0,50)',
    type: '异常',
  },
]);
// Mock.mock({
//   totals: '@integer(90,100)',
//   publish: '@integer(0,50)',
//   unPublish: '@integer(0,50)',
//   exception: '@integer(0,50)',
// });
const todoListData = Mock.mock({
  'items|12': [
    {
      id: '@id',
      sbmter: '@cname',
      sbmtTime: '@date',
      title: '@ctitle',
      memo: '@ctitle',
    },
  ],
});
const deployListData = Mock.mock({
  'items|12': [
    {
      id: '@id',
      dplyer: '@cname',
      dplyTime: '@date',
      title: '@ctitle',
      memo: '@ctitle',
    },
  ],
});
const newsListData = Mock.mock({
  'items|8': [
    {
      id: '@id',
      sender: '@cname',
      sendTime: '@date',
      title: '@ctitle',
      memo: '@ctitle',
      cnteId: '@id',
      cnteStas: 'opened',
      cnteRepo: '@word(5)',
    },
  ],
});
const fileList = Mock.mock({
  'items|6': [
    {
      id: '@id',
      fileTitle: '@ctitle',
    },
  ],
});
const annoList = Mock.mock({
  'items|5': [
    {
      id: '@id',
      annoTime: '@date',
      annoTitle: '@ctitle',
      'annoType|1': ['升级', '更新', '告警'],
    },
  ],
});
module.exports = {
  'POST /wokb/allData ': ({ query }) => {
    return ResultUtil.success({
      prodList: wokbProd,
      fileList: fileList.items,
      annoList: annoList.items,
      todoList: todoListData.items,
      todoTotal: todoListData.items.length,
      deployList: deployListData.items,
      newsList: newsListData.items,
    });
  },
  'POST /wokb/product ': ({ query }) => {
    return ResultUtil.success(wokbProd);
  },
  'POST /wokb/todoList ': ({ query }) => {
    const { page = 1, pageSize = 20 } = query;
    const pageData = ResultUtil.pagination(page, pageSize, todoListData.items);
    return ResultUtil.pageSuccess(pageData, todoListData.items.length);
  },
  'POST /wokb/deployList ': ({ query }) => {
    const { page = 1, pageSize = 20 } = query;
    const pageData = ResultUtil.pagination(page, pageSize, deployListData.items);
    return ResultUtil.pageSuccess(pageData, deployListData.items.length);
  },
  'POST /wokb/newsList ': ({ query }) => {
    const { page = 1, pageSize = 20 } = query;
    const pageData = ResultUtil.pagination(page, pageSize, newsListData.items);
    return ResultUtil.pageSuccess(pageData, newsListData.items.length);
  },
};
