import { BasicColumn } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
  },
  {
    title: '编号',
    dataIndex: 'no',
    width: 80,
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '开始时间',
    dataIndex: 'beginTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
  },
];

export const data: any[] = (() => {
  const arr: any[] = [];
  for (let index = 0; index < 40; index++) {
    arr.push({
      id: `${index}`,
      name: `${index} John Brown`,
      age: `${index + 10}`,
      no: `${index}98678`,
      address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
      beginTime: new Date().toLocaleString(),
      endTime: new Date().toLocaleString(),
    });
  }
  return arr;
})();

// ["ID", "姓名", "年龄", "编号", "地址", "开始时间", "结束时间"]
export const arrHeader = columns.map((column) => column.title);
// [["ID", "姓名", "年龄", "编号", "地址", "开始时间", "结束时间"],["0", "0 John Brown", "10", "098678"]]
export const arrData = data.map((item) => {
  return Object.keys(item).map((key) => item[key]);
});
