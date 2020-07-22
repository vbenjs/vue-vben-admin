<script lang="tsx">
  import { defineComponent, computed, unref, PropOptions } from 'compatible-vue';

  import { Icon } from '@/components/icon/index';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';

  export default defineComponent({
    name: 'BaseArrow',
    props: {
      // 展开  收缩,默认展开
      expand: {
        type: Boolean,
        default: true,
      } as PropOptions<boolean>,
    },
    setup(props, { emit }) {
      const { prefixCls } = useDesign('base-arrow');

      const getClass = computed(() => {
        const cls = [prefixCls];
        props.expand && cls.push(`${prefixCls}__active`);
        return cls;
      });
      return () => (
        <Icon
          onClick={() => {
            emit('click');
          }}
          type="right"
          class={unref(getClass)}
        />
      );
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-base-arrow';

  .@{prefix-cls} {
    transform: rotate(-90deg);
    transition: all 0.3s ease 0.1s;
    transform-origin: center center;

    &__active {
      transform: rotate(90deg);
      transition: all 0.3s ease 0.1s;
    }
  }
</style>
