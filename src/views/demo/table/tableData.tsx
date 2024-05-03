import { optionsListApi } from '@/api/demo/select';
import { FormProps, FormSchema, BasicColumn } from '@/components/Table';
import { VxeFormItemProps, VxeGridPropTypes } from '@/components/VxeTable';
import { ref } from 'vue';
import { Input } from 'ant-design-vue';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 200,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 150,
      sorter: true,
      defaultHidden: true,
    },
    {
      title: '开始时间',
      width: 150,
      sorter: true,
      dataIndex: 'beginTime',
    },
    {
      title: '结束时间',
      width: 150,
      sorter: true,
      dataIndex: 'endTime',
    },
  ];
}

export function getBasicShortColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      width: 150,
      dataIndex: 'id',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 80,
    },
  ];
}

export function getMultipleHeaderColumns(): BasicColumn[] {
  const testRef = ref('姓名:');
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '姓名',
      customHeaderRender() {
        return (
          <Input placeholder="输入值 更新 自定义title" size="small" v-model:value={testRef.value} />
        );
      },
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
      children: [
        {
          title: '编号',
          customHeaderRender(column) {
            // 【自定义渲染的】
            return (
              <div>
                _ <span style="background: #f00; color: #fff;">{testRef.value}</span> _
                {column.customTitle}
              </div>
            );
          },
          dataIndex: 'no',
          width: 120,
          filters: [
            { text: 'Male', value: 'male', children: [] },
            { text: 'Female', value: 'female', children: [] },
          ],
        },

        {
          title: '开始时间',
          dataIndex: 'beginTime',
          width: 120,
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          width: 120,
        },
      ],
    },
  ];
}

export function getCustomHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      helpMessage: 'headerHelpMessage方式1',
      width: 200,
    },
    {
      // title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      // title: '地址',
      dataIndex: 'address',
      width: 120,
      sorter: true,
    },

    {
      title: '编号',
      dataIndex: 'no',
      width: 120,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 120,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 120,
    },
  ];
}

const cellContent = (_, index) => ({
  colSpan: index === 9 ? 0 : 1,
});

export function getMergeHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      customCell: (_, index) => ({
        colSpan: index === 9 ? 6 : 1,
      }),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 300,
      customCell: cellContent,
    },
    {
      title: '地址',
      dataIndex: 'address',
      colSpan: 2,
      width: 120,
      sorter: true,
      customCell: (_, index) => ({
        rowSpan: index === 2 ? 2 : 1,
        colSpan: index === 3 || index === 9 ? 0 : 1,
      }),
    },
    {
      title: '编号',
      dataIndex: 'no',
      colSpan: 0,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
      customCell: cellContent,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 200,
      customCell: cellContent,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
      customCell: cellContent,
    },
  ];
}
export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: FormSchema[] = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    });
  }
  return arr;
};
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `Slot示例`,
        slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  };
}
export function getBasicData() {
  return (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
      });
    }
    return arr;
  })();
}

export function getTreeTableData() {
  return (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
        children: [
          {
            id: `l2-${index}-1`,
            name: 'John Brown',
            age: `1`,
            no: `${index + 10}`,
            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString(),
            children: [
              {
                id: `l3-${index}-1-1`,
                name: 'John Brown',
                age: `11`,
                no: `11`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
              },
              {
                id: `l3-${index}-1-2`,
                name: 'John Brown',
                age: `12`,
                no: `12`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
              },
            ],
          },
          {
            id: `l2-${index}-2`,
            name: 'John Brown',
            age: `2`,
            no: `${index + 10}`,
            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString(),
            children: [
              {
                id: `l3-${index}-2-1`,
                name: 'John Brown',
                age: `21`,
                no: `21`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
              },
              {
                id: `l3-${index}-2-2`,
                name: 'John Brown',
                age: `22`,
                no: `22`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
              },
            ],
          },
        ],
      });
    }
    return arr;
  })();
}

export const vxeTableColumns: VxeGridPropTypes.Columns = [
  {
    title: '序号',
    type: 'seq',
    fixed: 'left',
    width: '50',
    align: 'center',
  },
  {
    title: '固定列',
    field: 'name',
    width: 150,
    showOverflow: 'tooltip',
    fixed: 'left',
  },
  {
    title: '自适应列',
    field: 'address',
  },
  {
    title: '自定义列(自定义导出)',
    field: 'no',
    width: 200,
    showOverflow: 'tooltip',
    align: 'center',
    slots: {
      default: ({ row }) => {
        const text = `自定义${row.no}`;
        return [<div class="text-red-500">{text}</div>];
      },
    },
    exportMethod: ({ row }) => {
      return `自定义${row.no}导出`;
    },
  },
  {
    title: '自定义编辑',
    width: 150,
    field: 'name1',
    align: 'center',
    editRender: {
      name: 'AInput',
      placeholder: '请点击输入',
    },
  },
  {
    title: '开始时间',
    width: 150,
    field: 'beginTime',
    showOverflow: 'tooltip',
    align: 'center',
  },
  {
    title: '结束时间',
    width: 150,
    field: 'endTime',
    showOverflow: 'tooltip',
    align: 'center',
  },
  {
    width: 160,
    title: '操作',
    align: 'center',
    slots: { default: 'action' },
    fixed: 'right',
  },
];

export const vxeTableFormSchema: VxeFormItemProps[] = [
  {
    field: 'field0',
    title: 'field0',
    itemRender: {
      name: 'AInput',
    },
    span: 6,
  },
  {
    field: 'field1',
    title: 'field1',
    itemRender: {
      name: 'AApiSelect',
      props: {
        api: optionsListApi,
        resultField: 'list',
        labelField: 'name',
        valueField: 'id',
      },
    },
    span: 6,
  },
  {
    span: 12,
    align: 'right',
    className: '!pr-0',
    itemRender: {
      name: 'AButtonGroup',
      children: [
        {
          props: { type: 'primary', content: '查询', htmlType: 'submit' },
          attrs: { class: 'mr-2' },
        },
        { props: { type: 'default', htmlType: 'reset', content: '重置' } },
      ],
    },
  },
];
