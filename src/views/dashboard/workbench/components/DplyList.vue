<script lang="tsx">
  import { defineComponent, computed, unref } from 'compatible-vue';
  import { Timeline } from 'ant-design-vue';
  import { CollapseContainer, ScrollContainer } from '@/components/container/index';

  import { useDesign } from '@/hooks/core/useDesign';

  import { wokbStore } from '../store';
  // import { DplyItem } from '@/api/dashboard/model/wokbModel';

  export default defineComponent({
    name: 'DplyList',
    setup() {
      const { prefixCls } = useDesign('dply-list');
      const getDplyList = computed(() => {
        return wokbStore.getDplyList;
      });
      // function handleAppr(item: DplyItem) {
      //   console.log(item);
      // }

      return () => (
        // <div class={prefixCls}>
        <CollapseContainer class={prefixCls} title="部署记录" canExpan={false}>
          <ScrollContainer>
            <Timeline>
              {unref(getDplyList).map((item) => {
                const { id, dplyer, dplyTime, title } = item;
                return (
                  <Timeline.Item key={id} class={`${prefixCls}__item`}>
                    {dplyTime}
                    <span class={`${prefixCls}__item-light`}>&nbsp;{dplyer}&nbsp;</span>在
                    <span class={`${prefixCls}__item-light`}>&nbsp;{title}&nbsp;</span>部署代码
                    <span class={`${prefixCls}__item-light`}>&nbsp;{id}&nbsp;</span>成功
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </ScrollContainer>
        </CollapseContainer>
        // </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-dply-list';
  .@{prefix-cls} {
    // padding: 24px;
    // background: #fff;
    /deep/ .@{namespace}-collapse-container__body {
      height: 220px;
    }

    &__item {
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      color: #2c3a61;

      &-light {
        font-size: 14px;
        line-height: 22px;
        color: #0593ff;
      }
    }
  }
</style>
