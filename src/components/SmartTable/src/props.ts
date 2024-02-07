import type {
  SmartTableProps,
  SmartTableProxyConfig,
  TableHeightType,
  SmartTableToolbarConfig,
  SmartCheckboxConfig,
} from './types/SmartTableType';
import type { SmartColumn } from './types/SmartTableColumnType';
import type { VxeGridPropTypes } from 'vxe-table';

import { ComponentPropsOptions } from 'vue';
import { propTypes } from '@/utils/propTypes';
import { SmartTableAddEditConfig } from '@/components/SmartTable';
import { buildUUID } from '@/utils/uuid';
import { defaultCheckboxConfig } from './defaultConfig';

export const smartTableProps: ComponentPropsOptions<SmartTableProps> = {
  columns: {
    type: [Array] as PropType<SmartColumn[]>,
    default: () => [],
  },
  height: {
    type: [String, Number] as PropType<TableHeightType>,
  },
  loading: propTypes.bool,
  // 使用搜索表单
  useSearchForm: propTypes.bool,
  toolbarConfig: Object as PropType<SmartTableToolbarConfig>,
  pagerConfig: [Object, Boolean] as PropType<boolean | VxeGridPropTypes.PagerConfig>,
  proxyConfig: Object as PropType<SmartTableProxyConfig>,
  addEditConfig: Object as PropType<SmartTableAddEditConfig>,

  size: {
    type: String as PropType<VxeGridPropTypes.Size>,
    default: 'small',
  },
  id: propTypes.string.def(buildUUID()),
  checkboxConfig: {
    type: Object as PropType<SmartCheckboxConfig>,
    default: () => {
      return defaultCheckboxConfig;
    },
  },
};
