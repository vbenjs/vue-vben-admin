import * as xlsx from 'xlsx';
import type { WorkBook } from 'xlsx';
import type { JsonToSheet, AoAToSheet } from './typing';

const { utils, writeFile } = xlsx;

const DEF_FILE_NAME = 'excel-list.xlsx';

function computedStrWidth(str: string) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      //如果是汉字，则字符串长度加2
      length += 2;
    } else {
      length++;
    }
  }
  return length;
}

/**
 * @param data source data
 * @param worksheet worksheet object
 * @param min min width
 */
function setColumnWidth(data, worksheet, header, min = 3) {
  const obj = {};
  worksheet['!cols'] = [];
  if (header) {
    Object.keys(header).forEach((key) => {
      obj[key] = computedStrWidth(header[key]);
    });
  }
  data.splice(1).forEach((item) => {
    Object.keys(item).forEach((key) => {
      const cur = item[key];
      const length = computedStrWidth((cur || '').toString());
      obj[key] = Math.max(obj[key], length, min);
    });
  });
  Object.keys(obj).forEach((key) => {
    worksheet['!cols'].push({
      wch: obj[key],
    });
  });
}

export function jsonToSheetXlsx<T = any>({
  data,
  header,
  filename = DEF_FILE_NAME,
  json2sheetOpts = {},
  write2excelOpts = { bookType: 'xlsx' },
}: JsonToSheet<T>) {
  const arrData = [...data];
  if (header) {
    arrData.unshift(header);
    json2sheetOpts.skipHeader = true;
  }

  const worksheet = utils.json_to_sheet(arrData, json2sheetOpts);
  setColumnWidth(arrData, worksheet, header);
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
  filename = DEF_FILE_NAME,
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
