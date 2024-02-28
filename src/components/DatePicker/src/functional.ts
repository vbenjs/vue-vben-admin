import dayjs from "dayjs";

export const getWeekRange: (
  date: any,
  num: number,
  format: string
) => [any, any] = (date: any, num = 0, format: string) => {
  const day = dayjs(date).day();
  const weekOfday = day === 0 ? 7 : day; // 计算是这周第几天
  const sunday = dayjs(date)
    .add(7 - weekOfday + 7 * num, "day")
    .format(format); // 周日日期
  const monday = dayjs(date)
    .subtract(weekOfday - 1 - 7 * num, "day")
    .format(format); // 周一日期
  return [monday, sunday];
};
