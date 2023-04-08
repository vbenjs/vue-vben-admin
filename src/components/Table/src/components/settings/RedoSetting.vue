<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('common.redo') }}</span>
    </template>
    <RedoOutlined @click="redo" />
  </Tooltip>
</template>
<script lang="ts">
  import { RedoOutlined } from '@vben/icons';
  import { Tooltip } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { useI18n } from '@/hooks/web/useI18n';

  import { useTableContext } from '../../hooks/useTableContext';

  export default defineComponent({
    name: 'RedoSetting',
    components: {
      RedoOutlined,
      Tooltip,
    },
    setup() {
      const table = useTableContext();
      const { t } = useI18n();

      function redo() {
        table.reload();
      }

      return { redo, t };
    },
  });
</script>
