<template>
  <BasicTitle :class="prefixCls" v-if="getTitle" :helpMessage="helpMessage">
    {{ getTitle }}
  </BasicTitle>
</template>
<script lang="ts" setup>
  import { computed, PropType } from 'vue';
  import { BasicTitle } from '@/components/Basic';
  import { useDesign } from '@/hooks/web/useDesign';
  import { isFunction } from '@/utils/is';

  defineOptions({ name: 'BasicTableTitle' });

  const props = defineProps({
    title: {
      type: [Function, String] as PropType<string | ((data) => string)>,
    },
    getSelectRows: {
      type: Function as PropType<() => any[]>,
    },
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
  });

  const { prefixCls } = useDesign('basic-table-title');

  const getTitle = computed(() => {
    const { title, getSelectRows = () => {} } = props;
    let tit = title;

    if (isFunction(title)) {
      tit = title({
        selectRows: getSelectRows(),
      });
    }
    return tit;
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-title';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
