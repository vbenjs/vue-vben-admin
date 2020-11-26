import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobSetting } from '../setting';
import { useI18n } from './useI18n';
import { setTitle } from '/@/utils/browser';

export function useTitle() {
  const { currentRoute } = useRouter();
  const { t } = useI18n();
  watch(
    () => currentRoute.value.path,
    () => {
      const globSetting = useGlobSetting();
      setTitle(t(currentRoute.value.meta.title), globSetting.title);
    },
    { immediate: true, flush: 'post' }
  );
}
