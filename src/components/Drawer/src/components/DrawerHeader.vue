<template>
  <BasicTitle v-if="!isDetail" :class="prefixCls">
    <slot name="title"></slot>
    {{ !$slots.title ? title : '' }}
  </BasicTitle>

  <div :class="[prefixCls, `${prefixCls}--detail`]" v-else>
    <span :class="`${prefixCls}__twrap`">
      <span @click="handleClose" v-if="showDetailBack">
        <ArrowLeftOutlined :class="`${prefixCls}__back`" />
      </span>
      <span v-if="title">{{ title }}</span>
    </span>

    <span :class="`${prefixCls}__toolbar`">
      <slot name="titleToolbar"></slot>
    </span>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTitle } from '@/components/Basic';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { propTypes } from '@/utils/propTypes';

  defineOptions({ name: 'BasicDrawerHeader' });

  defineProps({
    isDetail: propTypes.bool,
    showDetailBack: propTypes.bool,
    title: propTypes.string,
  });

  const emit = defineEmits(['close']);

  const { prefixCls } = useDesign('basic-drawer-header');

  function handleClose() {
    emit('close');
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-drawer-header';
  @footer-height: 60px;
  .@{prefix-cls} {
    display: flex;
    align-items: center;
    height: 100%;

    &__back {
      padding: 0 12px;
      cursor: pointer;

      &:hover {
        color: @primary-color;
      }
    }

    &__twrap {
      flex: 1;
    }

    &__toolbar {
      padding-right: 50px;
    }
  }
</style>
