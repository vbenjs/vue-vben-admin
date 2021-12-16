import type { JSON2SheetOpts, WritingOptions, BookType } from 'xlsx';

export interface ExcelData<T = any> {
  header: string[];
  results: T[];
  meta: { sheetName: string };
}

export interface JsonToSheet<T = any> {
  data: T[];
  header?: T;
  filename?: string;
  json2sheetOpts?: JSON2SheetOpts;
  write2excelOpts?: WritingOptions;
}

export interface AoAToSheet<T = any> {
  data: T[][];
  header?: T[];
  filename?: string;
  write2excelOpts?: WritingOptions;
}

export interface ExportModalResult {
  filename: string;
  bookType: BookType;
}

export interface ExportExcel {
  api: (...arg: any) => Promise<any>;
  params: any;
  fileName?: string;
  beginDownloadFn?: () => any;
  downloadSuccessFn?: () => void;
  downloadErrorFn?: (er: Error) => void;
  downLoadComplete?: (er: Error) => void;
  isLoading?: boolean;
}
