import { VxeGlobalRendererHandles, VxeGlobalRendererOptions } from 'vxe-table';
import XEUtils from 'xe-utils';
import {
  createEditRender,
  createCellRender,
  createFormItemRender,
  createExportMethod,
} from './common';

function matchCascaderData(index: number, list: any[], values: any[], labels: any[]) {
  const val = values[index];
  if (list && values.length > index) {
    XEUtils.each(list, (item) => {
      if (item.value === val) {
        labels.push(item.label);
        matchCascaderData(++index, item.children, values, labels);
      }
    });
  }
}

function getCascaderCellValue(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderTableCellParams,
) {
  const { props = {} } = renderOpts;
  const { row, column } = params;
  const cellValue = XEUtils.get(row, column.field as string);
  const values = cellValue || [];
  const labels: Array<any> = [];
  matchCascaderData(0, props.options, values, labels);
  return (
    props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels
  ).join(` ${props.separator || '/'} `);
}

export default {
  renderTableEdit: createEditRender(),
  renderTableCell: createCellRender(getCascaderCellValue),
  renderFormItemContent: createFormItemRender(),
  tableExportMethod: createExportMethod(getCascaderCellValue),
} as VxeGlobalRendererOptions;
