import { UploadResult } from '@/api/demo/model/fileModel';
export { UploadResult };

export interface PublicProps {
  isUploadImg: boolean;
}
export interface BasicProps extends PublicProps {
  helpText: string;
  maxSize: number;
  maxNumber: number;
  accept: Array<string>;
  multiple: boolean;
  // isUploadImg: boolean;
  /**
   * Uploading URL
   * @type string | Function
   */
  action: string | Function;
}

// // TODO: 根据真实的接口返回类型，修改
// export interface UploadResult {
//   name: string;
//   status: string;
//   thumbUrl: string;
//   url: string;
// }
export interface PriviewProps extends PublicProps {
  priviewList: UploadResult[];
  // isUploadImg: boolean;
}

export interface UploadContainerProps extends BasicProps, PublicProps {
  value?: UploadResult[];
}

export type TargetContext = '_self' | '_blank';

export enum UploadResultStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface VaFile extends File {
  thumbUrl?: string;
}
