<script lang="tsx">
  // components
  import { defineComponent, computed, unref, PropOptions } from 'compatible-vue';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';

  import { SizeEnum, sizeMap } from '@/enums/sizeEnum';

  import { BasicLoadingProps } from './type';

  import svgLoadingImg from '@/assets/images/loading.svg';

  export default defineComponent({
    name: 'BasicLoading',
    props: {
      tip: {
        type: String,
        default: '',
      } as PropOptions<string>,
      size: {
        type: String,
        default: SizeEnum.DEFAULT,
        validator: (v: SizeEnum): boolean => {
          return [SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE].includes(v);
        },
      } as PropOptions<SizeEnum>,
    },
    setup(props: BasicLoadingProps) {
      const getLoadingIconSize = computed(() => {
        const { size } = props;
        return sizeMap.get(size);
      });

      // 样式前缀
      const { prefixCls } = useDesign('basic-loading');

      return () => {
        const { tip } = props;
        const size = unref(getLoadingIconSize);
        return (
          <section class={prefixCls}>
            <img src={svgLoadingImg} alt="" height={size} width={size} class="g-loading" />
            {props.tip && <span class={`${prefixCls}__tip`}> {tip}</span>}
          </section>
        );
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-basic-loading';

  .@{prefix-cls} {
    position: relative;
    width: auto;

    &__tip {
      display: block;
      margin-top: 4px;
      font-size: 13px;
      color: @text-color-base;
      text-align: center;
    }
  }
</style>
