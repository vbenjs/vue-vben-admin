import { unref, computed } from 'compatible-vue';
import { PageEnum } from '@/enums/pageEnum';
import { getRuntimeVM } from '@/setup/vue/runtimeVm';

export const useRouter = () => {
  const vm = getRuntimeVM();
  const route = computed(() => vm.$route);
  return { route, router: vm.$router };
};

/**
 * @description: 刷新当前界面
 */
export const useRedo = () => {
  const { route, router } = useRouter();
  router.push({
    path: '/redirect' + unref(route).fullPath,
  });
};

/**
 * @description: 跳转页面
 */
export const useGo = ({
  path = PageEnum.BASE_HOME,
  replace = true,
}: {
  path?: PageEnum;
  replace?: boolean;
} = {}) => {
  const { router } = useRouter();
  replace ? router.replace(path) : router.push(path);
};
