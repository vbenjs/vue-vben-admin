import { useAppStore } from '@/store/modules/app';
import { computed } from 'vue';

const tableButtonSizeMap: { [index: string]: string } = {
  medium: 'middle',
  small: 'small',
  mini: 'small',
};

export const useSizeSetting = () => {
  const appStore = useAppStore();

  const getButtonSize = computed(() => appStore.getSizeSetting.button);
  const getTableSize = computed(() => appStore.getSizeSetting.table);
  const getFormSize = computed(() => appStore.getSizeSetting.form);

  const tableButtonSizeConfig = computed(() => {
    // @ts-ignore
    return tableButtonSizeMap[getTableSize.value] || 'small';
  });

  return {
    getButtonSize,
    getTableSize,
    getFormSize,
    tableSizeConfig: getTableSize,
    buttonSizeConfig: getButtonSize,
    formSizeConfig: getFormSize,
    tableButtonSizeConfig,
  };
};
