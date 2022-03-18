import { request } from '@pkg/request'

export interface AreaModel {
  id: string
  code: string
  parentCode: string
  name: string
  levelType: number
  [key: string]: string | number
}

export interface AreaParams {
  parentCode: string
}

enum Api {
  AREA_RECORD = '/cascader/getAreaRecord',
}

export const areaRecord = (data: AreaParams) =>
  request.post<AreaModel>({ url: Api.AREA_RECORD, data })
