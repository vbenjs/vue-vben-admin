import { VxeGlobalRendererHandles } from 'vxe-table';
import XEUtils from 'xe-utils';
import {
  createEditRender,
  createCellRender,
  isEmptyValue,
  createFormItemRender,
  createExportMethod,
} from './common';

function getTreeSelectCellValue(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderCellParams | VxeGlobalRendererHandles.ExportMethodParams,
) {
  const { props = {} } = renderOpts;
  const { treeData, treeCheckable } = props;
  const { row, column } = params;
  const cellValue = XEUtils.get(row, column.field as string);
  if (!isEmptyValue(cellValue)) {
    return XEUtils.map(treeCheckable ? cellValue : [cellValue], (value) => {
      const matchObj = XEUtils.findTree(treeData, (item: any) => item.value === value, {
        children: 'children',
      });
      return matchObj ? matchObj.item.title : value;
    }).join(', ');
  }
  return cellValue;
}

export default {
  renderEdit: createEditRender(),
  renderCell: createCellRender(getTreeSelectCellValue),
  renderItemContent: createFormItemRender(),
  exportMethod: createExportMethod(getTreeSelectCellValue),
};
