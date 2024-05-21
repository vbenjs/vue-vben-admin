import { isHttpUrl, openWindow } from '@vben-core/toolkit';

import { useRouter } from 'vue-router';

function useNavigation() {
  const router = useRouter();

  const navigation = async (path: string) => {
    if (isHttpUrl(path)) {
      openWindow(path, { target: '_blank' });
    } else {
      await router.push(path);
    }
  };

  return { navigation };
}

export { useNavigation };
