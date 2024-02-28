import { withInstall } from '@/utils';
import weekPicker from './src/WeekPicker.vue';
import dayPicker from './src/DayPicker.vue';
import yearPicker from './src/YearPicker.vue';
import monthPicker from './src/MonthPicker.vue';

export const WeekPicker = withInstall(weekPicker);
export const DayPicker = withInstall(dayPicker);
export const YearPicker = withInstall(yearPicker);
export const MonthPicker = withInstall(monthPicker);
