<template>
  <div class="table-settings">
    <RedoSetting v-if="getSetting.redo" />
    <SizeSetting v-if="getSetting.size" />
    <ColumnSetting v-if="getSetting.setting" />
    <FullScreenSetting v-if="getSetting.fullScreen" />
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { TableSetting } from '../../types/table';

  import { defineComponent, computed } from 'vue';

  import ColumnSetting from './ColumnSetting.vue';
  import SizeSetting from './SizeSetting.vue';
  import RedoSetting from './RedoSetting.vue';
  import FullScreenSetting from './FullScreenSetting.vue';

  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'TableSetting',
    components: {
      ColumnSetting,
      SizeSetting,
      RedoSetting,
      FullScreenSetting,
    },
    props: {
      setting: {
        type: Object as PropType<TableSetting>,
        default: () => ({}),
      },
    },
    setup(props) {
      const { t } = useI18n();

      const getSetting = computed((): TableSetting => {
        return {
          redo: true,
          size: true,
          setting: true,
          fullScreen: false,
          ...props.setting,
        };
      });

      return { getSetting, t };
    },
  });
</script>
<style lang="less">
  .table-settings {
    & > * {
      margin-right: 12px;
    }

    svg {
      width: 1.3em;
      height: 1.3em;
    }
  }
</style>
