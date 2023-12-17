import { Controller, FromQuery, HttpGet } from '@wangminghua/koa-restful';
import { resultSuccess } from '../../../_util';

@Controller()
export class TreeController {
  @HttpGet()
  getDemoOptions(@FromQuery() keyword?: string) {
    console.log(keyword);
    return resultSuccess(demoTreeList(keyword));
  }
}
const demoTreeList = (keyword) => {
  const result = {
    list: [] as any[],
  };
  for (let index = 0; index < 5; index++) {
    const children: any[] = [];
    for (let j = 0; j < 3; j++) {
      children.push({
        title: `${keyword ?? ''}选项${index}-${j}`,
        value: `${index}-${j}`,
        key: `${index}-${j}`,
      });
    }
    result.list.push({
      title: `${keyword ?? ''}选项${index}`,
      value: `${index}`,
      key: `${index}`,
      children,
    });
  }
  return result;
};
