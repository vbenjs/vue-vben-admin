// export interface UploadApiResult {
//   message: string;
//   code: number;
//   url: string;
// }
/**
 * @interface UploadResultData
 * @description fileID 附件id
 * @description name 文件名
 * @description url 文件地址（拼接地址）
 * @description type 文件类型
 */
export interface UploadResponseData {
  fjid: string;
  fjgs?: string;
  clgs?: string;
  clmc?: string;
  fjmc?: string;
  url?: string;
}

export interface UploadApiResultData {
  fjgs: string;
  fjid: string;
  fjmc: string;
  fjurl: string;
}

export interface UploadApiResult {
  msg: string;
  code: number;
  data: UploadResponseData;
}
