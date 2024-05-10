import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
    ifShow: false,
  },
  {
    title: '文件名',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '预览图',
    dataIndex: 'path',
    width: 150,
  },
  {
    title: '文件后缀',
    dataIndex: 'extName',
    width: 80,
  },
  {
    title: '类别',
    dataIndex: 'type',
    width: 80,
  },
  {
    title: '大小',
    dataIndex: 'size',
    width: 80,
    customRender: ({ record }) => {
      return h(Tag, { color: 'blue' }, () => record.size);
    },
  },
  {
    title: '上传者',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 160,
    format: (text) => formatToDateTime(text),
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '文件名',
    component: 'Input',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: 'extName',
    label: '文件后缀',
    component: 'Input',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: 'time',
    label: '时间',
    component: 'RangePicker',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
];
