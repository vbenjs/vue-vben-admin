<template>
  <div class="table-settings">
    <RedoSetting v-if="getSetting.redo" :getPopupContainer="getTableContainer" />
    <SizeSetting v-if="getSetting.size" :getPopupContainer="getTableContainer" />
    <ColumnSetting
      v-if="getSetting.setting"
      @columns-change="handleColumnChange"
      :getPopupContainer="getTableContainer"
      :cache="getSetting.settingCache"
    />
    <FullScreenSetting v-if="getSetting.fullScreen" :getPopupContainer="getTableContainer" />
  </div>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';
  import type { TableSetting, ColumnChangeParam } from '../../types/table';
  import { computed, unref } from 'vue';
  import ColumnSetting from './ColumnSetting.vue';
  import SizeSetting from './SizeSetting.vue';
  import RedoSetting from './RedoSetting.vue';
  import FullScreenSetting from './FullScreenSetting.vue';
  import { useTableContext } from '../../hooks/useTableContext';

  defineOptions({ name: 'TableSetting' });

  const props = defineProps({
    setting: {
      type: Object as PropType<TableSetting>,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['columns-change']);

  const table = useTableContext();

  const getSetting = computed((): TableSetting => {
    return {
      redo: true,
      size: true,
      setting: true,
      settingCache: false,
      fullScreen: false,
      ...props.setting,
    };
  });

  function handleColumnChange(data: ColumnChangeParam[]) {
    emit('columns-change', data);
  }

  function getTableContainer() {
    return table ? unref(table.wrapRef) : document.body;
  }
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
