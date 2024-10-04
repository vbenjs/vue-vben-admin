import type { SetupVxeTable } from './types';

import { watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import {
  VxeButton,
  VxeButtonGroup,
  // VxeCheckbox,
  // VxeCheckboxGroup,
  VxeForm,
  // VxeFormGather,
  // VxeFormItem,
  VxeIcon,
  VxeInput,
  VxeLoading,
  VxePager,
  // VxeList,
  // VxeModal,
  // VxeOptgroup,
  // VxeOption,
  // VxePulldown,
  // VxeRadio,
  // VxeRadioButton,
  // VxeRadioGroup,
  VxeSelect,
  VxeTooltip,
  VxeUI,
  // VxeSwitch,
  // VxeTextarea,
} from 'vxe-pc-ui';

// 导入默认的语言
import zhCN from 'vxe-pc-ui/lib/language/zh-CN';
import {
  VxeColgroup,
  VxeColumn,
  VxeGrid,
  VxeTable,
  VxeToolbar,
} from 'vxe-table';

// 是否加载过
let isInit = false;

export function initVxeTable() {
  if (isInit) {
    return;
  }

  VxeUI.component(VxeTable);
  VxeUI.component(VxeColumn);
  VxeUI.component(VxeColgroup);
  VxeUI.component(VxeLoading);
  VxeUI.component(VxeGrid);
  VxeUI.component(VxeToolbar);
  VxeUI.setI18n('zh-CN', zhCN);
  VxeUI.setLanguage('zh-CN');

  VxeUI.component(VxeButton);
  VxeUI.component(VxeButtonGroup);
  // VxeUI.component(VxeCheckbox);
  // VxeUI.component(VxeCheckboxGroup);
  VxeUI.component(VxeForm);
  // VxeUI.component(VxeFormGather);
  // VxeUI.component(VxeFormItem);
  VxeUI.component(VxeIcon);
  VxeUI.component(VxeInput);
  // VxeUI.component(VxeList);
  VxeUI.component(VxeLoading);
  // VxeUI.component(VxeModal);
  // VxeUI.component(VxeOptgroup);
  // VxeUI.component(VxeOption);
  VxeUI.component(VxePager);
  // VxeUI.component(VxePulldown);
  // VxeUI.component(VxeRadio);
  // VxeUI.component(VxeRadioButton);
  // VxeUI.component(VxeRadioGroup);
  VxeUI.component(VxeSelect);
  // VxeUI.component(VxeSwitch);
  // VxeUI.component(VxeTextarea);
  VxeUI.component(VxeTooltip);

  isInit = true;
}

export function setupVbenVxeTable(setupOptions: SetupVxeTable) {
  const { configVxeTable } = setupOptions;
  const preference = usePreferences();

  watch(
    () => preference.theme.value,
    (theme) => {
      VxeUI.setTheme(theme === 'dark' ? 'dark' : 'light');
    },
    {
      immediate: true,
    },
  );

  configVxeTable(VxeUI);
}
