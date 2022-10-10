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
