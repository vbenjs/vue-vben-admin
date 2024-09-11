import { VxeGlobalRendererOptions } from 'vxe-table';
import { getDatePickerCellValue } from './ADatePicker';
import {
  createEditRender,
  createCellRender,
  createFormItemRender,
  createExportMethod,
} from './common';

export default {
  renderTableEdit: createEditRender(),
  renderTableCell: createCellRender(getDatePickerCellValue, () => {
    return ['YYYY'];
  }),
  renderFormItemContent: createFormItemRender(),
  tableExportMethod: createExportMethod(getDatePickerCellValue, () => {
    return ['YYYY'];
  }),
} as VxeGlobalRendererOptions;
