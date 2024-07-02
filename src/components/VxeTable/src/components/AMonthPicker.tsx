import { VxeGlobalRendererOptions } from 'vxe-table';
import { getDatePickerCellValue } from './ADatePicker';
import {
  createCellRender,
  createEditRender,
  createExportMethod,
  createFormItemRender,
} from './common';

export default {
  renderTableEdit: createEditRender(),
  renderTableCell: createCellRender(getDatePickerCellValue, () => {
    return ['YYYY-MM'];
  }),
  renderFormItemContent: createFormItemRender(),
  tableExportMethod: createExportMethod(getDatePickerCellValue, () => {
    return ['YYYY-MM'];
  }),
} as VxeGlobalRendererOptions;
