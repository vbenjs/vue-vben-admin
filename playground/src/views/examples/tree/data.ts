export const data = [
  {
    label: '一级 1',
    value: '1',
    children: [
      {
        label: '二级 1-1',
        value: '1-1',
        icon: 'mdi:account-box',
        children: [
          { label: '三级 1-1-1', value: '1-1-1' },
          {
            label: '三级 1-1-2',
            value: '1-1-2',
            children: [{ label: '四级 1-1-2-1', value: '1-1-2-1' }],
          },
        ],
      },
      {
        label: '二级 1-2',
        value: '1-2',
        children: [
          { label: '三级 1-2-1', value: '1-2-1' },
          { label: '三级 1-2-2', value: '1-2-2' },
          { label: '三级 1-2-3', value: '1-2-3' },
          { label: '三级 1-2-4', value: '1-2-4' },
          { label: '三级 1-2-5', value: '1-2-5' },
          { label: '三级 1-2-6', value: '1-2-6' },
        ],
      },
    ],
  },
  {
    label: '一级 2',
    value: '2',
    children: [
      {
        label: '二级 2-1',
        value: '2-1',
        children: [
          { label: '三级 2-1-1', value: '2-1-1' },
          { label: '三级 2-1-2', value: '2-1-2' },
        ],
      },
      {
        label: '二级 2-2',
        value: '2-2',
        children: [
          { label: '三级 2-2-1', value: '2-2-1' },
          { label: '三级 2-2-2', value: '2-2-2' },
        ],
      },
    ],
  },
];
