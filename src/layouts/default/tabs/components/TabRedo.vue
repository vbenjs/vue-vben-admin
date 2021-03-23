<template>
  <Tooltip :title="t('common.redo')" placement="bottom" :mouseEnterDelay="0.5">
    <span :class="`${prefixCls}__extra-redo`" @click="handleRedo">
      <RedoOutlined :spin="loading" />
    </span>
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { RedoOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTabs } from '/@/hooks/web/useTabs';

  export default defineComponent({
    name: 'TabRedo',
    components: { RedoOutlined, Tooltip },

    setup() {
      const loading = ref(false);
      const { prefixCls } = useDesign('multiple-tabs-content');
      const { t } = useI18n();
      const { refreshPage } = useTabs();

      async function handleRedo() {
        loading.value = true;
        await refreshPage();
        setTimeout(() => {
          loading.value = false;
          // Animation execution time
        }, 1000);
      }
      return { prefixCls, t, handleRedo, loading };
    },
  });
</script>
