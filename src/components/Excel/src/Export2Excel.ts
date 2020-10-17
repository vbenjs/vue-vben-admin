import xlsx from 'xlsx';
import type { WorkBook } from 'xlsx';
import type { JsonToSheet, AoAToSheet } from './types';
// import { isObject } from '@/src/utils/is';

const { utils, writeFile } = xlsx;

export function jsonToSheetXlsx<T = any>({
  data,
  header,
  filename = 'excel-list.xlsx',
  json2sheetOpts = {},
  write2excelOpts = { bookType: 'xlsx' },
}: JsonToSheet<T>) {
  const arrData = [...data];
  if (header) {
    arrData.unshift(header);
    json2sheetOpts.skipHeader = true;
  }

  const worksheet = utils.json_to_sheet(arrData, json2sheetOpts);

  /* add worksheet to workbook */
  const workbook: WorkBook = {
    SheetNames: [filename],
    Sheets: {
      [filename]: worksheet,
    },
  };
  /* output format determined by filename */
  writeFile(workbook, filename, write2excelOpts);
  /* at this point, out.xlsb will have been downloaded */
}
export function aoaToSheetXlsx<T = any>({
  data,
  header,
  filename = 'excel-list.xlsx',
  write2excelOpts = { bookType: 'xlsx' },
}: AoAToSheet<T>) {
  const arrData = [...data];
  if (header) {
    arrData.unshift(header);
  }

  const worksheet = utils.aoa_to_sheet(arrData);

  /* add worksheet to workbook */
  const workbook: WorkBook = {
    SheetNames: [filename],
    Sheets: {
      [filename]: worksheet,
    },
  };
  /* output format determined by filename */
  writeFile(workbook, filename, write2excelOpts);
  /* at this point, out.xlsb will have been downloaded */
}
