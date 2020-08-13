import { unref, computed, getCurrentInstance, Vue } from 'compatible-vue';
import { pageEnum } from '@/enums/pageEnum';
// import { getRuntimeVM } from '@/setup/vue/runtimeVm';

let runtimeVm: Vue | null = null;

export function setupInitRumTimeVm() {
  const currentInstance = getCurrentInstance();
  if (currentInstance && !runtimeVm) {
    runtimeVm = currentInstance;
  }
}

export const useRouter = () => {
  const route = computed(() => runtimeVm!.$route);
  return { routeRef: route, router: runtimeVm!.$router };
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
}: {
  path?: pageEnum;
  replace?: boolean;
} = {}) => {
  const { router } = useRouter();
  replace ? router.replace(path) : router.push(path);
};
