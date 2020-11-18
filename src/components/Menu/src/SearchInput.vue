<template>
  <section class="menu-search-input" @Click="handleClick" :class="searchClass">
    <a-input-search
      placeholder="菜单搜索"
      class="menu-search-input__search"
      allowClear
      @change="handleChange"
    />
  </section>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';
  import { ThemeEnum } from '/@/enums/appEnum';

  // hook
  import { useDebounce } from '/@/hooks/core/useDebounce';
  //
  export default defineComponent({
    name: 'BasicMenuSearchInput',
    props: {
      // Whether to expand, used in the left menu
      collapsed: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      theme: {
        type: String as PropType<ThemeEnum>,
      },
    },
    setup(props, { emit }) {
      const [debounceEmitChange] = useDebounce(emitChange, 200);

      function emitChange(value?: string): void {
        emit('change', value);
      }

      function handleChange(e: ChangeEvent): void {
        const { collapsed } = props;
        if (collapsed) return;
        debounceEmitChange(e.target.value);
      }

      function handleClick(): void {
        emit('click');
      }

      const searchClass = computed(() => {
        const cls: string[] = [];
        cls.push(props.theme ? `menu-search-input__search--${props.theme}` : '');
        cls.push(props.collapsed ? 'hide-search-icon' : '');
        return cls;
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
    margin: 12px 8px;

    &.hide-search-icon {
      .ant-input,
      .ant-input-suffix {
        opacity: 0;
        transition: all 0.5s;
      }
    }

    &__search--dark {
      .ant-input-affix-wrapper,
      .ant-input {
        .set-bg();
      }

      .ant-input-search-icon,
      .ant-input-clear-icon {
        color: rgba(255, 255, 255, 0.4) !important;
      }
    }

    &__search--light {
      .ant-input-affix-wrapper,
      .ant-input {
        color: @text-color-base;
        background: #fff;
        outline: none;
      }

      .ant-input-search-icon {
        color: @icon-color;
      }
    }
  }

  .set-bg() {
    color: #fff;
    background: @sider-dark-lighten-1-bg-color;
    border: 0;
    outline: none;
  }
  .hide-outline() {
    border: none;
    outline: none;
    box-shadow: none;
  }
</style>
