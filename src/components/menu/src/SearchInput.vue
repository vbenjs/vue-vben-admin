<script lang="tsx">
  import { Input } from 'ant-design-vue';
  // import { Icon } from '@/components/icon/index';
  import { defineComponent, computed, unref } from 'compatible-vue';

  // import { unwrap } from '@/utils/composition/index';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { useDebounce } from '@/hooks/core/useDebounce';
  import { appStore } from '@/store/modules/app';
  //
  export default defineComponent({
    name: 'BasicMenuSearchInput',
    props: {
      // 是否展开,用于左侧菜单
      collapsed: {
        type: Boolean,
        default: true,
      },
    },
    setup(props, { emit }) {
      const { prefixCls } = useDesign('menu-input');

      function emitChange(value?: string): void {
        emit('change', value);
      }
      const [debounceEmitChange] = useDebounce(emitChange, 150);
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
        const theme = appStore.projCfgState!.menuSetting.theme;
        return theme ? `${prefixCls}__search--${theme}` : '';
      });

      return () => {
        const { collapsed } = props;
        return (
          <section class={prefixCls} onClick={handleClick}>
            <Input.Search
              placeholder="菜单搜索"
              class={[`${prefixCls}__search`, unref(searchClass)]}
              allowClear
              onChange={handleChange}
              disabled={collapsed}
            />
          </section>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-menu-input';
  // 输入框背景颜色 深
  @input-dark-bg-color: #516085;

  @icon-color: #c0c4cc;

  .@{prefix-cls} {
    margin: 12px 9px;

    &__search--dark {
      /deep/ .ant-input {
        .set-bg();

        &:hover {
          .hide-outline();
        }

        &:focus {
          .hide-outline();
        }
      }

      /deep/ .ant-input-search-icon {
        color: @icon-color;
      }
    }

    &__search--light {
      /deep/ .ant-input {
        color: @text-color-base;
        background: #fff;
        border: 0;
        outline: none;

        &:hover {
          .hide-outline();
        }

        &:focus {
          .hide-outline();
        }
      }

      /deep/ .ant-input-search-icon {
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
