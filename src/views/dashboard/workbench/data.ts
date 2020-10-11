export const wokbProd = [
  {
    amount: '20',
    type: '成品总数',
  },
  {
    amount: '50',
    type: '未发布',
  },
  {
    amount: '80',
    type: '发布中',
  },
  {
    amount: '100',
    type: '异常',
  },
];

export const todoList = (() => {
  const ret: any[] = [];
  for (let index = 0; index < 3; index++) {
    ret.push({
      id: index,
      sbmter: '张三',
      sbmtTime: new Date().toLocaleString(),
      title: '主要',
      memo: '工作任务',
    });
  }
  return ret;
})();
export const newList = (() => {
  const ret: any[] = [];
  for (let index = 0; index < 3; index++) {
    ret.push({
      id: index,
      sender: '李四',
      sendTime: new Date().toLocaleString(),
      title: '代码',
      memo: '工作任务',
      cnteId: `c${index}`,
      cnteStas: 'opened',
      cnteRepo: index,
    });
  }
  return ret;
})();
