export const treeData: Record<string, any> = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          {
            value: 'xihu',
            label: '西湖',
          },
          {
            value: 'sudi',
            label: '苏堤',
          },
        ],
      },
      {
        value: 'jiaxing',
        label: '嘉兴',
        children: [
          {
            value: 'wuzhen',
            label: '乌镇',
          },
          {
            value: 'meihuazhou',
            label: '梅花洲',
          },
        ],
      },
      {
        value: 'zhoushan',
        label: '舟山',
        children: [
          {
            value: 'putuoshan',
            label: '普陀山',
          },
          {
            value: 'taohuadao',
            label: '桃花岛',
          },
        ],
      },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          {
            value: 'zhonghuamen',
            label: '中华门',
          },
          {
            value: 'zijinshan',
            label: '紫金山',
          },
          {
            value: 'yuhuatai',
            label: '雨花台',
          },
        ],
      },
    ],
  },
];
