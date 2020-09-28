export interface Options {
  show?: boolean;
  imageList: string[];
  index?: number;
}

export interface Props {
  show: boolean;
  instance: Props;
  imageList: string[];
  index: number;
}
