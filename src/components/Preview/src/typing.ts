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

export interface ImageProps {
  alt?: string;
  fallback?: string;
  src: string;
  width: string | number;
  height?: string | number;
  placeholder?: string | boolean;
  preview?:
    | boolean
    | {
        visible?: boolean;
        onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
        getContainer: string | HTMLElement | (() => HTMLElement);
      };
}

export type ImageItem = string | ImageProps;
