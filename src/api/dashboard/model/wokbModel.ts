export enum ProdTypeEnum {
  TOTAL,
  PUBLISH,
  UNPUBLISH,
  EXCEPTION,
}
export interface ProdItem {
  amount: number;
  type: ProdTypeEnum;
}
// export interface WokbProdModel {
//   totals: number;
//   publish: number;
//   unPublish: number;
//   exception: number;
// }
export interface TodoItem {
  id: string;
  sbmter: string;
  sbmtTime: string;
  title: string;
  memo: string;
}

export interface DplyItem {
  id: string;
  dplyer: string;
  dplyTime: string;
  title: string;
  memo: string;
}
export interface NewsItem {
  id: string;
  sender: string;
  sendTime: string;
  title: string;
  memo: string;
  cnteId: string;
  cnteStas: string;
  cnteRepo: string;
}
export interface ListRsltModel<T> {
  items: T[];
  total: number;
}
export interface FileItem {
  id: string;
  fileTitle: string;
}
export interface AnnoItem {
  id: string;
  annoTime: string;
  annoTitle: string;
  annoType: string;
}
export interface WokbAllRsltModel {
  prodList: ProdItem[];
  fileList: FileItem[];
  annoList: AnnoItem[];
}
