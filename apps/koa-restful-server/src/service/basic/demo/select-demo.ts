import { Controller, FromQuery, HttpPost } from '@wangminghua/koa-restful';
import { resultSuccess } from '../../../_util';

@Controller()
export class SelectController {
  @HttpPost()
  getDemoOptions(@FromQuery() keyword?: string, @FromQuery() count?: number) {
    console.log(keyword);
    return resultSuccess(demoList(keyword, count));
  }
}
const demoList = (keyword, count = 20) => {
  const result = {
    list: [] as any[],
  };
  for (let index = 0; index < count; index++) {
    result.list.push({
      name: `${keyword ?? ''}选项${index}`,
      id: `${index}`,
    });
  }
  return result;
};
