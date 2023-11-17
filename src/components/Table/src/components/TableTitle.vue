<template>
  <BasicTitle :class="prefixCls" v-if="titleOrComponent" :helpMessage="helpMessage">
    <template v-if="isVNode(titleOrComponent)">
      <titleOrComponent />
    </template>
    <template v-else>
      {{ titleOrComponent }}
    </template>
  </BasicTitle>
</template>
<script lang="ts" setup>
  import { computed, isVNode, PropType, VNodeChild } from 'vue';
  import { BasicTitle } from '@/components/Basic';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isFunction, isString } from '/@/utils/is';

  const props = defineProps({
    title: {
      type: [Function, String] as PropType<string | ((data) => string) | VNodeChild>,
    },
    getSelectRows: {
      type: Function as PropType<() => any[]>,
    },
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
  });
  const { prefixCls } = useDesign('basic-table-title');

  const titleOrComponent = computed(() => {
    const { title, getSelectRows = () => {} } = props;
    if (isFunction(title)) {
      return title({
        selectRows: getSelectRows(),
      });
    } else if (isString(title)) {
      return title;
    }
    return title;
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
