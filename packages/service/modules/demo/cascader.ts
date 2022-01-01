import type { AreaModel, AreaParams } from '../model'
import { defaultRequest } from '../../request'

enum Api {
  AREA_RECORD = '/cascader/getAreaRecord',
}

export const areaRecord = (data: AreaParams) =>
  defaultRequest.post<AreaModel>({ url: Api.AREA_RECORD, data })
