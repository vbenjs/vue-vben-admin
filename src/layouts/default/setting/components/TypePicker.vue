<template>
  <div :class="prefixCls">
    <template v-for="item in menuTypeList || []" :key="item.title">
      <Tooltip :title="item.title" placement="bottom">
        <div
          @click="handler(item)"
          :class="[
            `${prefixCls}__item`,
            `${prefixCls}__item--${item.type}`,
            {
              [`${prefixCls}__item--active`]: def === item.type,
            },
          ]"
        >
          <div class="mix-sidebar"></div>
        </div>
      </Tooltip>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';

  import { Tooltip } from 'ant-design-vue';
  import { useDesign } from '@/hooks/web/useDesign';

  import { menuTypeListEnum } from '../enum';

  defineOptions({ name: 'MenuTypePicker' });

  defineProps({
    menuTypeList: {
      type: Array as PropType<typeof menuTypeListEnum>,
      default: () => [],
    },
    handler: {
      type: Function,
      default: () => ({}),
    },
    def: {
      type: String,
      default: '',
    },
  });

  const { prefixCls } = useDesign('setting-menu-type-picker');
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-menu-type-picker';

  .@{prefix-cls} {
    display: flex;

    &__item {
      position: relative;
      width: 56px;
      height: 48px;
      margin-right: 16px;
      overflow: hidden;
      border-radius: 4px;
      background-color: #f0f2f5;
      box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        position: absolute;
      }

      &--sidebar,
      &--light {
        &::before {
          z-index: 1;
          top: 0;
          left: 0;
          width: 33%;
          height: 100%;
          border-radius: 4px 0 0 4px;
          background-color: #273352;
        }

        &::after {
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: #fff;
        }
      }

      &--mix {
        &::before {
          top: 0;
          left: 0;
          width: 33%;
          height: 100%;
          border-radius: 4px 0 0 4px;
          background-color: #fff;
        }

        &::after {
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: #273352;
        }
      }

      &--top-menu {
        &::after {
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: #273352;
        }
      }

      &--dark {
        background-color: #273352;
      }

      &--mix-sidebar {
        &::before {
          z-index: 1;
          top: 0;
          left: 0;
          width: 25%;
          height: 100%;
          border-radius: 4px 0 0 4px;
          background-color: #273352;
        }

        &::after {
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: #fff;
        }

        .mix-sidebar {
          position: absolute;
          left: 25%;
          width: 15%;
          height: 100%;
          background-color: #fff;
        }
      }

      &:hover,
      &--active {
        padding: 12px;
        border: 2px solid @primary-color;

        &::before,
        &::after {
          border-radius: 0;
        }
      }
    }

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
</style>
