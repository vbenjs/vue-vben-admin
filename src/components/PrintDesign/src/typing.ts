import { Ref } from 'vue';

export interface PaperSize {
  width: number;
  height: number;
}

export type PaperType = 'A3' | 'A4' | 'A5' | 'B3' | 'B4' | 'B5' | '测试标签' | 'other';

export interface Paper {
  type: PaperType;
  width: number;
  height: number;
  scale: number;
}

export interface Options {
  show?: boolean;
  template: any;
}
export interface JsonOptions extends Options {
  showUpdate?: boolean;
}

export interface PrintPreviewOptions extends Options {
  width?: number | string;
  hiprintData?: any;
  showPrintBtn?: boolean;
  showPdfBtn?: boolean;
}

export interface HiPrintProps {
  designEleId: string;
  settingContainer: string;
  printElementContainer: string;
  paginationContainer?: string;
  provider?: {
    f: any;
    value: any;
  };
  paper?: Ref<Paper>;
  panel?: any;
  config?: Object;
}
