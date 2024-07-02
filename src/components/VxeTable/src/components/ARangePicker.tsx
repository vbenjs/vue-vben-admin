import { VxeColumnPropTypes, VxeGlobalRendererHandles, VxeGlobalRendererOptions } from 'vxe-table';
import XEUtils from 'xe-utils';
import {
  createCellRender,
  createEditRender,
  createExportMethod,
  createFormItemRender,
} from './common';

function getRangePickerCellValue(
  renderOpts: VxeColumnPropTypes.EditRender,
  params:
    | VxeGlobalRendererHandles.RenderTableCellParams
    | VxeGlobalRendererHandles.ExportMethodParams,
) {
  const { props = {} } = renderOpts;
  const { row, column } = params;
  let cellValue = XEUtils.get(row, column.field as string);
  if (cellValue) {
    cellValue = XEUtils.map(cellValue, (date: any) =>
      date.format(props.format || 'YYYY-MM-DD'),
    ).join(' ~ ');
  }
  return cellValue;
}

export default {
  renderTableEdit: createEditRender(),
  renderTableCell: createCellRender(getRangePickerCellValue),
  renderFormItemContent: createFormItemRender(),
  tableExportMethod: createExportMethod(getRangePickerCellValue),
} as VxeGlobalRendererOptions;
