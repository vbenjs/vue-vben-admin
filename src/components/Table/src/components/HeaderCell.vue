<template>
  <EditTableHeaderCell v-if="getIsEdit">
    {{ getTitle }}
  </EditTableHeaderCell>
  <span v-else>{{ getTitle }}</span>
  <BasicHelp v-if="getHelpMessage" :text="getHelpMessage" :class="`${prefixCls}__help`" />
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { BasicColumn } from '../types/table';

  import { defineComponent, computed } from 'vue';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useDesign } from '/@/hooks/web/useDesign';
  export default defineComponent({
    name: 'TableHeaderCell',
    components: {
      EditTableHeaderCell: createAsyncComponent(() => import('./EditTableHeaderIcon.vue')),
      BasicHelp: createAsyncComponent(() => import('/@/components/Basic/src/BasicHelp.vue')),
    },
    props: {
      column: {
        type: Object as PropType<BasicColumn>,
        default: {},
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-table-header-cell');
      const getIsEdit = computed(() => {
        return !!props.column?.edit;
      });

      const getTitle = computed(() => {
        return props.column?.customTitle;
      });

      const getHelpMessage = computed(() => {
        return props.column?.helpMessage;
      });

      return { prefixCls, getIsEdit, getTitle, getHelpMessage };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-header-cell';

  .@{prefix-cls} {
    &__help {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
</style>
