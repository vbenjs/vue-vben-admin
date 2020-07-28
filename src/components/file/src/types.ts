export interface BasicProps {
  helpText: string;
  maxSize: number;
  maxNumber: number;
  accept: Array<string>;
  multiple: boolean;
  uploadImg: boolean;
  /**
   * Uploading URL
   * @type string | Function
   */
  action: string | Function;
}

// TODO: 根据真实的接口返回类型，修改
export interface UploadResult {
  name: string;
  status: string;
  thumbUrl: string;
  url: string;
}
export interface PriviewProps {
  priviewList: UploadResult[];
  uploadImg: boolean;
}

export interface UploadContainerProps extends BasicProps, PriviewProps {}

export type TargetContext = '_self' | '_blank';
