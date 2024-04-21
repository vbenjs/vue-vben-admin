import { VxeColumnPropTypes, VxeGlobalRendererHandles } from 'vxe-table';
import XEUtils from 'xe-utils';
import {
  createCellRender,
  createEditRender,
  createExportMethod,
  createFormItemRender,
} from './common';

function getRangePickerCellValue(
  renderOpts: VxeColumnPropTypes.EditRender,
  params: VxeGlobalRendererHandles.RenderCellParams | VxeGlobalRendererHandles.ExportMethodParams,
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
  renderEdit: createEditRender(),
  renderCell: createCellRender(getRangePickerCellValue),
  renderItemContent: createFormItemRender(),
  exportMethod: createExportMethod(getRangePickerCellValue),
};
