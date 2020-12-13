<template>
  <div :class="prefixCls">
    <template v-for="item in menuTypeList || []" :key="item.title">
      <Tooltip :title="item.title" placement="bottom">
        <div
          @click="handler(item)"
          :class="[
            `${prefixCls}__item`,
            {
              [`${prefixCls}__item--active`]: def === item.type,
            },
          ]"
        >
          <img :src="item.src" />
        </div>
      </Tooltip>
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { Tooltip } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { menuTypeList } from '../enum';
  export default defineComponent({
    name: 'MenuTypePicker',
    components: { Tooltip },
    props: {
      menuTypeList: {
        type: Array as PropType<typeof menuTypeList>,
        defualt: [],
      },
      handler: {
        type: Function as PropType<Fn>,
        default: () => {},
      },
      def: {
        type: String,
      },
    },
    setup() {
      const { prefixCls } = useDesign('setting-menu-type-picker');

      return {
        prefixCls,
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../../../../design/index.less';
  @prefix-cls: ~'@{namespace}-setting-menu-type-picker';

  .@{prefix-cls} {
    display: flex;

    &__item {
      position: relative;
      width: 70px;
      height: 50px;
      margin: 0 20px 20px 0;
      cursor: pointer;
      border-radius: 6px;

      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        content: '';
        opacity: 0;
        transition: all 0.3s;
      }

      &:hover,
      &--active {
        &::after {
          top: -8px;
          left: -4px;
          width: 80px;
          height: 64px;
          border: 2px solid @primary-color;
          border-radius: 6px;
          opacity: 1;
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
