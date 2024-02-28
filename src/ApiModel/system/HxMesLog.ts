export interface HxMesLog {
  id: number;
  portType: string; // 盒、箱、退回
  errType: string; // 错误类型，校验、条码存在、未知
  barcode: string; // 条码值
  content: string; // 内容
  createdTime: string; // 创建时间
}

export interface QueryHxMesLogForm {
  portType?: string; // 盒、箱、退回
  errType?: string; // 错误类型，校验、条码存在、未知
  barcode?: string; // 条码值
}
