const labelText = "label";

export enum PlatformEnum {
  ADMIN = "ADMIN",
  WX_APP = "WX_APP",
}

export const platformOptions = [
  { [labelText]: "管理", value: PlatformEnum.ADMIN },
  { [labelText]: "微信小程序", value: PlatformEnum.WX_APP },
];

export const platformMap = (() => {
  const map = new Map<PlatformEnum, string>();

  map.set(PlatformEnum.ADMIN, "管理");
  map.set(PlatformEnum.WX_APP, "微信小程序");

  return map;
})();
