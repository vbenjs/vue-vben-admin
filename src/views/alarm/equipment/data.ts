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
    key: "setting",
    name: "告警设置",
    component: "Setting",
  },
  {
    key: "record",
    name: "告警记录",
    component: "Record",
  },
];
