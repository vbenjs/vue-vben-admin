<template>
  <div class="table-settings">
    <RedoSetting v-if="getSetting.size" />
    <SizeSetting v-if="getSetting.redo" />

    <ColumnSetting v-if="getSetting.setting" />

    <FullScreenSetting v-if="getSetting.fullScreen" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import type { TableSetting } from '../../types/table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import ColumnSetting from './ColumnSetting.vue';
  export default defineComponent({
    name: 'TableSetting',
    components: {
      ColumnSetting,
      SizeSetting: createAsyncComponent(() => import('./SizeSetting.vue')),
      RedoSetting: createAsyncComponent(() => import('./RedoSetting.vue')),
      FullScreenSetting: createAsyncComponent(() => import('./FullScreenSetting.vue')),
    },
    props: {
      setting: {
        type: Object as PropType<TableSetting>,
        default: {},
      },
    },
    setup(props) {
      const { t } = useI18n();

      const getSetting = computed(
        (): TableSetting => {
          return {
            redo: true,
            size: true,
            setting: true,
            fullScreen: true,
            ...props.setting,
          };
        }
      );

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
