<template>
  <LayoutLockPage />
  <BackTop v-if="getUseOpenBackTop" :target="getTarget" />
  <SettingDrawer v-if="getShowSettingButton" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { BackTop } from 'ant-design-vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  export default defineComponent({
    name: 'LayoutFeatures',
    components: {
      BackTop,
      LayoutLockPage: createAsyncComponent(() => import('/@/views/sys/lock/index.vue')),
      SettingDrawer: createAsyncComponent(() => import('/@/layouts/default/setting/index.vue')),
    },
    setup() {
      const { getUseOpenBackTop, getShowSettingButton } = useRootSetting();

      return {
        getTarget: () => document.body,
        getUseOpenBackTop,
        getShowSettingButton,
      };
    },
  });
</script>
