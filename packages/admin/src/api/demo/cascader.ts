import { defHttp } from '/@/utils/http/axios'
import type { AreaModel, AreaParams } from '@vben-admin/types/model'

enum Api {
  AREA_RECORD = '/cascader/getAreaRecord',
}

export const areaRecord = (data: AreaParams) =>
  defHttp.post<AreaModel>({ url: Api.AREA_RECORD, data })
