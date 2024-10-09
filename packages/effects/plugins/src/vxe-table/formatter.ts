import type { VxeUIExport } from 'vxe-table';

import dayjs from 'dayjs';

export function initDefaultFormatter(vxeUI: VxeUIExport) {
  vxeUI.formats.add('formatDate', {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD');
    },
  });

  vxeUI.formats.add('formatDateTime', {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
    },
  });
}
