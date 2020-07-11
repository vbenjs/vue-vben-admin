<script lang="tsx">
  // components
  import { defineComponent, computed, unref } from '@/setup/vue';
  import BasicLoading from './BasicLoading.vue';

  import { useDesign } from '@/hooks/core/useDesign';

  import { SizeEnum } from '@/enums/sizeEnum';

  export default defineComponent({
    name: 'FullLoading',
    props: {
      tip: {
        type: String,
        default: '',
      },
      absolute: Boolean,
    },
    setup(props) {
      // 样式前缀
      const { prefixCls } = useDesign('full-loading');

      const getStyle = computed(() => {
        return props.absolute
          ? {
              position: 'absolute',
              left: 0,
              top: 0,
              'z-index': 1,
            }
          : {};
      });
      return () => {
        const { tip } = props;
        return (
          <section class={prefixCls} style={unref(getStyle)}>
            <BasicLoading class={`${prefixCls}__loading`} tip={tip} size={SizeEnum.LARGE} />
          </section>
        );
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-full-loading';

  .@{prefix-cls} {
    .size(100%);

    background: @basic-mask-color;

    &__loading {
      // display: block;
      // margin: 0 auto;
      .abs-center(both);
    }
  }
</style>
