import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

/**
 * 通过ID查询
 * @param id ID
 */
export const handleGetById = async (id: string) => {
  return await defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: 'sys/dict/getById',
    data: { id: id },
  });
};

/**
 * 添加保存函数
 * @param model 添加保存参数
 */
export const handleSaveUpdate = async (model: any) => {
  return await defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: 'sys/dict/saveUpdate',
    data: model,
  });
};

/**
 * 删除函数
 * @param idList ID列表
 */
export const handleDelete = async (idList: Array<any>) => {
  return await defHttp.post(
    {
      service: ApiServiceEnum.SMART_SYSTEM,
      url: 'sys/dict/batchDeleteById',
      data: idList,
    },
    { errorMessageMode: 'modal' },
  );
};
