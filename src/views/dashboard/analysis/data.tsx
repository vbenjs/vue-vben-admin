import { GrowCardItem } from './types';

export const growCardList: GrowCardItem[] = [
  {
    title: '总用户数',
    icon: 'analysis-icon1',
    price: 80000,
    up: true,
    mom: '环比增长',
    percent: 2.5,
  },
  {
    title: '产品数量',
    icon: 'analysis-icon2',
    price: 4000,
    up: true,
    mom: '同比增长',
    percent: 3,
  },
  {
    title: '总营业额',
    icon: 'analysis-icon3',
    price: 3000000,
    up: false,
    mom: '环比降低',
    percent: 2,
  },
  {
    title: '总任务数',
    icon: 'analysis-icon4',
    price: 10000,
    up: false,
    mom: '同比降低',
    percent: 1,
  },
];
