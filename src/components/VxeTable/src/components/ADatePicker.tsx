import { VxeGlobalRendererHandles, VxeGlobalRendererOptions } from 'vxe-table';
import XEUtils from 'xe-utils';
import {
  createCellRender,
  createEditRender,
  createExportMethod,
  createFormItemRender,
} from './common';

export function getDatePickerCellValue(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params:
    | VxeGlobalRendererHandles.RenderTableCellParams
    | VxeGlobalRendererHandles.ExportMethodParams,
  defaultFormat: string,
) {
  const { props = {} } = renderOpts;
  const { row, column } = params;
  let cellValue = XEUtils.get(row, column.field as string);
  if (cellValue) {
    cellValue = cellValue.format(props.format || defaultFormat);
  }
  return cellValue;
}

export default {
  renderTableEdit: createEditRender(),
  renderTableCell: createCellRender(getDatePickerCellValue, () => {
    return ['YYYY-MM-DD'];
  }),
  renderFormItemContent: createFormItemRender(),
  tableExportMethod: createExportMethod(getDatePickerCellValue, () => {
    return ['YYYY-MM-DD'];
  }),
} as VxeGlobalRendererOptions;
