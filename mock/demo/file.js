const ResultUtil = require('../_util/resultUtil');
const Mock = require('mockjs');

module.exports = {
  'GET /file/upload ': ({ query }) => {
    const key = 'items|' + query.total;
    const mock = {};
    mock[key] = [
      {
        id: '@id',
        'url|1': [
          'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          'https://picsum.photos/id/66/346/216',
          'https://picsum.photos/id/67/346/216',
          'https://picsum.photos/id/68/346/216',
        ],
        name: Mock.mock('@ctitle(3,10)') + '.png',
        'status|1': ['success', 'error', 'success'],
      },
    ];

    const todoListData = Mock.mock(mock);
    if (Array.isArray(todoListData.items)) {
      return ResultUtil.success(todoListData.items);
    } else {
      return ResultUtil.success([todoListData.items]);
    }
  },
};
