const labelText = "label";

export type EquipmentType = "GATEWAY" | "SENSOR" | "CUSTOM";

export const equipmentTypeOptions = [
  { [labelText]: "网关", value: "GATEWAY" },
  { [labelText]: "传感器", value: "SENSOR" },
  { [labelText]: "自定义设备", value: "CUSTOM" },
];

export const equipmentTypeMap = (() => {
  const map = new Map<EquipmentType, string>();

  map.set("GATEWAY", "网关");
  map.set("SENSOR", "传感器");
  map.set("CUSTOM", "自定义设备");

  return map;
})();
