import { GrowCardItem, TaskItem } from './types';
import iconSvg1 from '/@/assets/svg/dashboard/analysis-icon1.svg';
import iconSvg2 from '/@/assets/svg/dashboard/analysis-icon2.svg';
import iconSvg3 from '/@/assets/svg/dashboard/analysis-icon3.svg';
import iconSvg4 from '/@/assets/svg/dashboard/analysis-icon4.svg';
export const taskList: TaskItem[] = [
  {
    percent: 50,
    title: '开发任务一',
    updateTime: '2020.7.12',
    desc: '开发任务一简介',
    status: 'active',
  },
  {
    percent: 67,
    title: '开发任务二',
    updateTime: '2020.3.12',
    desc: '开发任务二简介',
    status: 'exception',
  },
  {
    percent: 100,
    title: '开发任务三',
    updateTime: '2020.4.12',
    desc: '开发任务三简介',

    status: 'success',
  },
];
export const growCardList: GrowCardItem[] = [
  {
    title: '总用户数',
    icon: iconSvg1,
    price: 80000,
    up: true,
    mom: '环比增长',
    percent: 2.5,
  },
  {
    title: '产品数量',
    icon: iconSvg2,
    price: 4000,
    up: true,
    mom: '同比增长',
    percent: 3,
  },
  {
    title: '总营业额',
    icon: iconSvg3,
    price: 3000000,
    up: false,
    mom: '环比降低',
    percent: 2,
  },
  {
    title: '总任务数',
    icon: iconSvg4,
    price: 10000,
    up: false,
    mom: '同比降低',
    percent: 1,
  },
];
export const randomizeArray = function (arg: any) {
  const array = arg.slice();
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const sparklineData = [
  47,
  45,
  54,
  38,
  56,
  24,
  65,
  31,
  37,
  39,
  62,
  51,
  35,
  41,
  35,
  27,
  93,
  53,
  61,
  27,
  54,
  43,
  19,
  46,
];
