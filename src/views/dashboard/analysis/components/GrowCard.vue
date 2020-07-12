<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';
  import { SvgIcon } from '@/components/icon/index';
  import VueCountTo from 'vue-count-to';
  import { Statistic } from 'ant-design-vue';

  import { useDesign } from '@/hooks/core/useDesign';

  import { GrowCardItem } from '../types';

  interface Props {
    info: GrowCardItem;
  }
  export default defineComponent({
    name: 'GrowCard',
    props: {
      info: {
        type: Object,
        default: null,
      } as PropOptions<GrowCardItem>,
    },
    setup(props: Props) {
      const { prefixCls } = useDesign('grow-card');

      return () => {
        const { title, icon, up, mom, price, percent } = props.info;
        return (
          <div class={prefixCls}>
            <div class={`${prefixCls}-header`}>
              <div class={`${prefixCls}__info`}>
                <p class={`${prefixCls}__title`}>{title}</p>
                <VueCountTo prefix="$" startVal={1} endVal={price} />
              </div>
              <SvgIcon type={icon} size="4em" />
            </div>
            <div class={[`${prefixCls}-footer`, up ? 'is-up' : '']}>
              <Statistic value={`${percent}%`}>
                <template slot="prefix">
                  <SvgIcon type={up ? 'analysis-rise' : 'analysis-down'} />
                </template>
              </Statistic>
              <span class={`${prefixCls}__mom`}>{mom}</span>
            </div>
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-grow-card';
  .@{prefix-cls} {
    display: flex;
    width: calc(100% - 24px);
    height: 158px;
    padding: 16px 30px 12px 16px;
    margin: 0 12px 12px 12px;
    cursor: pointer;
    background: @white;
    border-radius: 14px;
    box-shadow: 6px 6px 54px 0 rgba(0, 0, 0, 0.05);
    flex-direction: column;

    &:hover {
      box-shadow: 6px 6px 54px 0 rgba(0, 0, 0, 0.1);
    }

    &-header {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    &__title {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      letter-spacing: 0;
      color: #2c3a61;
      opacity: 0.7;
    }

    &__info {
      span {
        font-family: NeoSans;
        font-size: 26px;
        line-height: 38px;
      }
    }

    &-footer {
      display: flex;
      width: 100%;
      margin-top: 24px;
      align-items: center;

      /deep/ .ant-statistic-content-value {
        color: @danger-color;
      }

      &.is-up {
        /deep/ .ant-statistic-content-value {
          color: @success-color;
        }
      }
    }

    &__mom {
      display: inline-block;
      padding-left: 10px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0;
      color: #606060;
    }
  }
</style>
