import { type CreateCrudOptionsRet, dict } from '@fast-crud/fast-crud';

import {
  addRequest,
  delRequest,
  editRequest,
  pageRequest,
} from '#/api/demos/fast-crud/index';

/**
 * 定义行数据模型
 * 如果你嫌定义数据模型麻烦，可以删掉此处，把下面出现的FirstRow用any代替即可
 */
export type FirstRow = {
  id?: number;
  name?: string;
  type?: number;
};

/**
 * 定义一个CrudOptions生成器方法
 */
export function createCrudOptions(): CreateCrudOptionsRet<FirstRow> {
  return {
    crudOptions: {
      // 这里定义两个字段
      columns: {
        name: {
          column: {
            // 表格列的一些配置
            resizable: true,
            width: 200,
          },
          search: { show: true },
          title: '姓名',
          type: 'text', // 字段类型，fs会根据字段类型，生成出一些默认配置
        },
        type: {
          dict: dict({
            data: [
              { label: '开始', value: 1 },
              { label: '停止', value: 0 },
            ],
          }),
          title: '类型',
          type: 'dict-select',
        },
      },
      // 在这里自定义你的crudOptions配置
      request: {
        addRequest,
        delRequest,
        editRequest,
        pageRequest,
      },
    },
  };
}
