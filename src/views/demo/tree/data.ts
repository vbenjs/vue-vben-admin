import { TreeItem } from '/@/components/Tree/index';

export const treeData: TreeItem[] = [
  {
    title: 'parent ',
    key: '0-0',
    children: [
      { title: 'leaf', key: '0-0-0' },
      {
        title: 'leaf',
        key: '0-0-1',
        children: [
          { title: 'leaf', key: '0-0-0-0', children: [{ title: 'leaf', key: '0-0-0-0-1' }] },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
    ],
  },
  {
    title: 'parent 2',
    key: '1-1',
    children: [
      { title: 'leaf', key: '1-1-0' },
      { title: 'leaf', key: '1-1-1' },
    ],
  },
  {
    title: 'parent 3',
    key: '2-2',
    children: [
      { title: 'leaf', key: '2-2-0' },
      { title: 'leaf', key: '2-2-1' },
    ],
  },
];

export const treeData2: any[] = [
  {
    name: 'parent ',
    id: '0-0',
    slots: { title: 'title' },
    children: [
      { name: 'leaf', id: '0-0-0', slots: { title: 'title' } },
      {
        name: 'leaf',
        id: '0-0-1',
        slots: { title: 'title' },
        children: [
          {
            name: 'leaf',
            slots: { title: 'title' },
            id: '0-0-0-0',
            children: [{ name: 'leaf', id: '0-0-0-0-1', slots: { title: 'title' } }],
          },
          { name: 'leaf', slots: { title: 'title' }, id: '0-0-0-1' },
        ],
      },
    ],
  },
  {
    name: 'parent 2',
    id: '1-1',
    slots: { title: 'title' },
    children: [
      { name: 'leaf', slots: { title: 'title' }, id: '1-1-0' },
      { name: 'leaf', slots: { title: 'title' }, id: '1-1-1' },
    ],
  },
  {
    name: 'parent 3',
    id: '2-2',
    slots: { title: 'title' },
    children: [
      { name: 'leaf', slots: { title: 'title' }, id: '2-2-0' },
      { name: 'leaf', slots: { title: 'title' }, id: '2-2-1' },
    ],
  },
];

export const treeData3: any[] = [
  {
    name: 'parent ',
    key: '0-0',
    slots: { title: 'title' },
    children: [
      { name: 'leaf', key: '0-0-0', slots: { title: 'title' } },
      {
        name: 'leaf',
        key: '0-0-1',
        slots: { title: 'title' },
        children: [
          {
            name: 'leaf',
            slots: { title: 'title' },
            key: '0-0-0-0',
            children: [{ name: 'leaf', key: '0-0-0-0-1', slots: { title: 'title' } }],
          },
          { name: 'leaf', slots: { title: 'title' }, key: '0-0-0-1' },
        ],
      },
    ],
  },
  {
    name: 'parent 2',
    key: '1-1',
    slots: { title: 'title' },
    children: [
      { name: 'leaf', slots: { title: 'title' }, key: '1-1-0' },
      { name: 'leaf', slots: { title: 'title' }, key: '1-1-1' },
    ],
  },
  {
    name: 'parent 3',
    key: '2-2',
    slots: { title: 'title' },
    children: [
      { name: 'leaf', slots: { title: 'title' }, key: '2-2-0' },
      { name: 'leaf', slots: { title: 'title' }, key: '2-2-1' },
    ],
  },
];
