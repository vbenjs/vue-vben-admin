export interface ListItem {
  key: string;
  name: string;
  component: string;
  icon?: string;
  auth?: string;
}

// tab的list
export const settingList: ListItem[] = [
  {
    key: 'RemindMessage',
    name: '通知方式',
    component: 'RemindMessage',
    icon: 'fe:bell',
    auth: 'RemindMessage',
  },
  {
    key: 'RemindTemplate',
    name: '通知模板',
    component: 'RemindTemplate',
    icon: 'heroicons-outline:template',
    auth: 'RemindTemplate',
  },
  {
    key: 'BusinessTime',
    name: '用电时间',
    component: 'BusinessTime',
    icon: 'icon-park-outline:time',
    auth: 'BusinessTime',
  },
  {
    key: 'other',
    name: '其他配置',
    component: 'OtherSettings',
    icon: 'mingcute:settings-6-line',
    auth: 'OtherConfig',
  },
];
