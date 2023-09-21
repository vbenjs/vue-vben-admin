import { computed } from 'vue';
import { theme } from 'ant-design-vue';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { ThemeEnum } from '/@/enums/appEnum';

export function useDarkModeTheme() {
  const { getDarkMode } = useRootSetting();
  const { darkAlgorithm } = theme;
  const isDark = computed(() => getDarkMode.value === ThemeEnum.DARK);
  const darkTheme = {
    algorithm: [darkAlgorithm],
  };

  return {
    isDark,
    darkTheme,
  };
}
