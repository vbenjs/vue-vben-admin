import { getDatePickerCellValue } from './ADatePicker';
import {
  createEditRender,
  createCellRender,
  createFormItemRender,
  createExportMethod,
} from './common';

export default {
  renderEdit: createEditRender(),
  renderCell: createCellRender(getDatePickerCellValue, () => {
    return ['HH:mm:ss'];
  }),
  renderItemContent: createFormItemRender(),
  exportMethod: createExportMethod(getDatePickerCellValue, () => {
    return ['HH:mm:ss'];
  }),
};
