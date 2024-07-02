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
    return ['HH:mm:ss'];
  }),
  renderFormItemContent: createFormItemRender(),
  tableExportMethod: createExportMethod(getDatePickerCellValue, () => {
    return ['HH:mm:ss'];
  }),
} as VxeGlobalRendererOptions;
