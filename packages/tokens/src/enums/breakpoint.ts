export enum ScreenSizeEnum {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  XXL = 'XXL',
}

export enum ScreenValueEnum {
  XS = 480,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1600,
}

const screenMap = new Map<ScreenSizeEnum, number>()

screenMap.set(ScreenSizeEnum.XS, ScreenValueEnum.XS)
screenMap.set(ScreenSizeEnum.SM, ScreenValueEnum.SM)
screenMap.set(ScreenSizeEnum.MD, ScreenValueEnum.MD)
screenMap.set(ScreenSizeEnum.LG, ScreenValueEnum.LG)
screenMap.set(ScreenSizeEnum.XL, ScreenValueEnum.XL)
screenMap.set(ScreenSizeEnum.XXL, ScreenValueEnum.XXL)

export { screenMap }
