export interface ListItem {
  title: string;
  icon: string;
  color?: string;
}

export interface TabItem {
  key: string;
  name: string;
  component: string;
}

export const tags: string[] = [
  '很有想法的',
  '专注设计',
  '川妹子',
  '大长腿',
  '海纳百川',
  '前端开发',
  'vue3',
];

export const teams: ListItem[] = [
  {
    icon: 'ant-design:alipay-circle-outlined',
    title: '科学搬砖组',
    color: '#ff4000',
  },
  {
    icon: 'emojione-monotone:letter-a',
    title: '中二少年团',
    color: '#7c51b8',
  },
  {
    icon: 'ant-design:alipay-circle-outlined',
    title: '高逼格设计',
    color: '#00adf7',
  },
  {
    icon: 'ant-design:codepen-circle-filled',
    title: '程序员日常',
    color: '#00adf7',
  },
  {
    icon: 'ant-design:behance-square-filled',
    title: '科学搬砖组',
    color: '#7c51b8',
  },
  {
    icon: 'ant-design:dribbble-circle-filled',
    title: '程序员日常',
    color: '#ff4000',
  },
];

export const details: ListItem[] = [
  {
    icon: 'ant-design:contacts-outlined',
    title: '交互专家',
  },
  {
    icon: 'ant-design:cluster-outlined',
    title: '某某某事业群',
  },
  {
    icon: 'ant-design:home-outlined',
    title: '福建省厦门市',
  },
];

export const achieveList: TabItem[] = [
  {
    key: '1',
    name: '文章',
    component: 'Article',
  },
  {
    key: '2',
    name: '应用',
    component: 'Application',
  },
  {
    key: '3',
    name: '项目',
    component: 'Project',
  },
];

export const actions: any[] = [
  { icon: 'ant-design:star-outlined', text: '156', color: '#018ffb' },
  { icon: 'ant-design:like-filled', text: '156', color: '#459ae8' },
  { icon: 'ant-design:message-filled', text: '2', color: '#42d27d' },
];

export const articleList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 4; i++) {
    result.push({
      title: 'Vben Admin',
      description: ['Vben', '设计语言', 'Typescript'],
      content: '基于Vue Next, TypeScript, Ant Design实现的一套完整的企业级后台管理系统。',
      time: '2020-11-14 11:20',
    });
  }
  return result;
})();

export const applicationList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 8; i++) {
    result.push({
      title: 'Vben Admin',
      icon: 'emojione-monotone:letter-a',
      color: '#1890ff',
      active: '100',
      new: '1,799',
      download: 'bx:bx-download',
    });
  }
  return result;
})();

export const projectList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 8; i++) {
    result.push({
      title: 'Vben Admin',
      content: '基于Vue Next, TypeScript, Ant Design实现的一套完整的企业级后台管理系统。',
    });
  }
  return result;
})();
