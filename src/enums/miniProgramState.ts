const labelText = "label";

export type MiniProgramState = "developer" | "trial" | "formal";

export const miniProgramStateOptions = [
  { [labelText]: "开发版", value: "developer" },
  { [labelText]: "体验版", value: "trial" },
  { [labelText]: "正式版", value: "formal" },
];

export const miniProgramStateMap = (() => {
  const map = new Map<MiniProgramState, string>();

  map.set("developer", "开发版");
  map.set("trial", "体验版");
  map.set("formal", "正式版");

  return map;
})();
