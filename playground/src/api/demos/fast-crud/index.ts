import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageRes,
} from '@fast-crud/fast-crud';

import _ from 'lodash-es';

interface RecordItem {
  id: number;
  name: string;
  type: number;
}

/**
 * 此处本地方式模拟远程接口，实际开发，你需要替换成你的后台请求
 */
const records: RecordItem[] = [{ id: 1, name: 'Hello World', type: 1 }];
export const pageRequest = async (): Promise<UserPageRes> => {
  return {
    limit: 20, // 后续会在transformRes里面做转化，转换为pageSize
    offset: 0, // 后续会在transformRes里面做转化，转换为currentPage
    records: structuredClone(records), // 此处跟fs所需字段一致，无需转换
    total: records.length,
  };
};
export const editRequest = async ({ form, row }: EditReq) => {
  const target = _.find(records, (item) => {
    return row.id === item.id;
  });
  _.merge(target, form);
  return target;
};
export const delRequest = async ({ row }: DelReq) => {
  _.remove(records, (item) => {
    return item.id === row.id;
  });
};
export const addRequest = async ({ form }: AddReq) => {
  const maxRecord = _.maxBy(records, (item) => {
    return item.id;
  });
  form.id = (maxRecord?.id || 0) + 1;
  records.push(form);
  return form;
};
