const labelText = "label";

export type ConditionType = "LT" | "GT";

export const conditionTypeOptions = [
  { [labelText]: "大于", value: "GT" },
  { [labelText]: "小于", value: "LT" },
];

export const conditionTypeMap = (() => {
  const map = new Map<ConditionType, string>();

  map.set("GT", "大于");
  map.set("LT", "小于");

  return map;
})();
