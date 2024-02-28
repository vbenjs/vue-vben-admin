export interface HomeCountInfo {
  dayHandleRemindCount: string;
  dayRemindCount: string;
  equipmentCount: string;
  gatewayCount: string;
  sensorCount: string;
  storeCount: string;
  totalHandleRemindCount: string;
  totalRemindCount: string;
}

export interface NameValueResult {
  name: string;
  value: number | string;
}

export interface NameCodeResult {
  name: string;
  code: string;
}

export interface HomeDataVo {
  //在库情况
  palletCount: number; //总托
  boxCount: number; //总箱
  packageCount: number; //总盒
  pieceCount: number; //总片数

  dayInPiece: number; //今日入库
  dayPendingPiece: number; //今日待入库
  dayOutPiece: number; //今日出库
}
