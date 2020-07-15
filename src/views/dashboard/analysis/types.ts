export interface GrowCardItem {
  icon: string;
  title: string;
  price: number;
  up: boolean;
  mom: string;
  percent: number;
}

export interface TaskItem {
  percent: number;
  status: 'success' | 'warn' | 'done';
  updateTime: string;
  title: string;
  desc: string;
}
