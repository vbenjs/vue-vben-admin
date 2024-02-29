const labelText = "label";

export type TerminalType = "DDA" | "MULTI_BUS" | "WN" | "PZG" | "EDGEX";

export const terminalTypeOptions = [
  { [labelText]: "DDA", value: "DDA" },
  { [labelText]: "MultiBus", value: "MULTI_BUS" },
  { [labelText]: "维恩", value: "WN" },
  { [labelText]: "品至高", value: "PZG" },
  { [labelText]: "EdgeX", value: "EDGEX" },
];

export const terminalTypeMap = (() => {
  const map = new Map<TerminalType, string>();

  map.set("DDA", "DDA");
  map.set("MULTI_BUS", "MultiBus");
  map.set("WN", "维恩");
  map.set("PZG", "品至高");
  map.set("EDGEX", "EdgeX");

  return map;
})();
