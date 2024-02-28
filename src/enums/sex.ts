export enum SexEnum {
  M = '男',
  F = '女',
}

export enum SexValueEnum {
  M = 'M',
  F = 'F',
}

export const sexMap: Map<SexEnum, SexValueEnum> = (() => {
  const map = new Map<SexEnum, SexValueEnum>();
  map.set(SexEnum.M, SexValueEnum.M);
  map.set(SexEnum.F, SexValueEnum.F);
  return map;
})();
