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
  sheetName?: string;
  json2sheetOpts?: JSON2SheetOpts;
  write2excelOpts?: WritingOptions;
}

export interface AoAToSheet<T = any> {
  data: T[][];
  header?: T[];
  filename?: string;
  sheetName?: string;
  write2excelOpts?: WritingOptions;
}

export interface ExportModalResult {
  filename: string;
  bookType: BookType;
}

export interface JsonToMultipleSheet<T = any> {
  sheetList: JsonToSheet<T>[];
  filename?: string;
  write2excelOpts?: WritingOptions;
}

export interface AoaToMultipleSheet<T = any> {
  sheetList: AoAToSheet<T>[];
  filename?: string;
  write2excelOpts?: WritingOptions;
}
