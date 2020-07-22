export interface BasicProps {
  helpText: string;
  maxSize: number;
  maxNumber: number;
  accept: Array<string>;
}

export interface UploadResult {
  name: string;
  status: string;
  thumbUrl: string;
  url: string;
}
