<template>
  <div ref="breadcrumbRef" class="breadcrumb">
    <slot />
  </div>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, provide, ref } from 'vue';

  export default defineComponent({
    name: 'Breadcrumb',
    props: {
      separator: {
        type: String as PropType<string>,
        default: '/',
      },
      separatorClass: {
        type: String as PropType<string>,
        default: '',
      },
    },
    setup(props) {
      const breadcrumbRef = ref<Nullable<HTMLElement>>(null);

      provide('breadcrumb', props);

      return {
        breadcrumbRef,
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../design/index.less';

  .breadcrumb {
    .unselect();

    height: @header-height;
    padding-right: 20px;
    font-size: 13px;
    line-height: @header-height;
    // line-height: 1;

    &::after,
    &::before {
      display: table;
      content: '';
    }

    &::after {
      clear: both;
    }

    &__separator {
      margin: 0 9px;
      font-weight: 700;
      color: @breadcrumb-item-normal-color;

      &[class*='icon'] {
        margin: 0 6px;
        font-weight: 400;
      }
    }

    &__item {
      float: left;
    }

    &__inner {
      color: @breadcrumb-item-normal-color;

      &.is-link,
      a {
        font-weight: 500;
        color: @text-color-base;
        text-decoration: none;
        transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      a:hover,
      &.is-link:hover {
        color: @primary-color;
        cursor: pointer;
      }
    }

    &__item:last-child .breadcrumb__inner,
    &__item:last-child &__inner a,
    &__item:last-child &__inner a:hover,
    &__item:last-child &__inner:hover {
      font-weight: 400;
      color: @breadcrumb-item-normal-color;
      cursor: text;
    }

    &__item:last-child &__separator {
      display: none;
    }
  }
</style>
