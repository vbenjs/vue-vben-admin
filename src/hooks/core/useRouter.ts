import { unref, computed } from 'compatible-vue';
import { pageEnum } from '@/enums/pageEnum';
import { getRuntimeVM } from '@/setup/vue/runtimeVm';
import VurRouter from 'vue-router';
export const useRouter = () => {
  const vm = getRuntimeVM();
  const route = computed(() => vm.$route);
  return { routeRef: route, router: vm.$router };
};

/**
 * @description: 刷新当前界面
 */
export const useRedo = () => {
  const { routeRef, router } = useRouter();
  router.push({
    path: '/redirect' + unref(routeRef).fullPath,
  });
};

/**
 * @description: 跳转页面
 */
export const useGo = ({
  path = pageEnum.BASE_HOME,
  replace = true,
  router: rootRouter,
}: {
  router?: VurRouter;
  path?: pageEnum;
  replace?: boolean;
} = {}) => {
  const { router } = useRouter();
  replace ? (rootRouter || router).replace(path) : (rootRouter || router).push(path);
};
