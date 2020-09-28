<template>
  <section class="menu-search-input" @Click="handleClick" :class="searchClass">
    <a-input-search
      placeholder="菜单搜索"
      class="menu-search-input__search"
      allowClear
      @change="handleChange"
      :disabled="collapsed"
    />
  </section>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';
  import { MenuThemeEnum } from '/@/enums/menuEnum';

  // hook
  import { useDebounce } from '/@/hooks/core/useDebounce';
  //
  export default defineComponent({
    name: 'BasicMenuSearchInput',
    props: {
      // 是否展开,用于左侧菜单
      collapsed: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      theme: {
        type: String as PropType<MenuThemeEnum>,
      },
    },
    setup(props, { emit }) {
      function emitChange(value?: string): void {
        emit('change', value);
      }
      const [debounceEmitChange] = useDebounce(emitChange, 200);
      /**
       * @description: 搜索
       */
      function handleChange(e: ChangeEvent): void {
        const { collapsed } = props;
        if (collapsed) {
          return;
        }
        debounceEmitChange(e.target.value);
      }
      /**
       * @description: 点击时间
       */
      function handleClick(): void {
        emit('click');
      }
      const searchClass = computed(() => {
        return props.theme ? `menu-search-input__search--${props.theme}` : '';
      });

      return { handleClick, searchClass, handleChange };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../../design/index.less';
  // 输入框背景颜色 深
  @input-dark-bg-color: #516085;

  @icon-color: #c0c4cc;

  .menu-search-input {
    margin: 12px 9px;

    &__search--dark {
      // .setPlaceholder('.ant-input',#fff);

      .ant-input {
        .set-bg();

        &:hover,
        &:focus {
          .hide-outline();
        }
      }

      .ant-input-search-icon,
      .ant-input-clear-icon {
        color: rgba(255, 255, 255, 0.6) !important;
      }

      .ant-input-clear-icon {
        color: rgba(255, 255, 255, 0.3) !important;
      }
    }

    &__search--light {
      .ant-input {
        color: @text-color-base;
        background: #fff;
        border: 0;
        outline: none;

        &:hover,
        &:focus {
          .hide-outline();
        }
      }

      .ant-input-search-icon {
        color: @icon-color;
      }
    }
  }

  .set-bg() {
    color: #fff;
    background: @input-dark-bg-color;
    border: 0;
    outline: none;
  }
  .hide-outline() {
    border: none;
    outline: none;
    box-shadow: none;
  }
</style>
