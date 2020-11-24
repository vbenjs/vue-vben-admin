import { defineComponent, unref, computed } from 'vue';
import { appStore } from '/@/store/modules/app';
import LockPage from '/@/views/sys/lock/index.vue';

export default defineComponent({
  name: 'LayoutLockPage',
  setup() {
    const getIsLockRef = computed(() => {
      const { getLockInfo } = appStore;
      const { isLock } = getLockInfo;
      return isLock;
    });
    return () => {
      return unref(getIsLockRef) ? <LockPage /> : null;
    };
  },
});
