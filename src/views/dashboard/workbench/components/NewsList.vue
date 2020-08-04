<script lang="tsx">
  import { defineComponent, computed, unref } from 'compatible-vue';
  import { List } from 'ant-design-vue';
  import { CollapseContainer, ScrollContainer } from '@/components/container/index';
  import headerImg from '@/assets/images/header.jpg';

  import { useDesign } from '@/hooks/core/useDesign';

  import { wokbStore } from '../store';
  // import { NewsItem } from '@/api/dashboard/model/wokbModel';

  export default defineComponent({
    name: 'NewsList',
    setup() {
      const { prefixCls } = useDesign('news-list');
      const getNewsList = computed(() => {
        return wokbStore.getNewsList;
      });

      return () => (
        // <div class={prefixCls}>
        <CollapseContainer class={prefixCls} title="动态" canExpan={false}>
          <ScrollContainer>
            <List>
              {unref(getNewsList).map((item) => {
                const { id, sender, sendTime, title, cnteId, cnteStas, cnteRepo } = item;
                return (
                  <List.Item key={id} class={`${prefixCls}__item`}>
                    <List.Item.Meta>
                      <img slot="avatar" src={headerImg} class={`${prefixCls}__item-avatar`} />
                      <div slot="description" class={`${prefixCls}__item-desc`}>
                        <div class={[`${prefixCls}__item-time`, 'mb-1']}> {sendTime}</div>
                        <div class={[`${prefixCls}__item-title`, 'mb-4']}>
                          <span class={`${prefixCls}__item-light`}>{sender}&nbsp;</span>申请迭代
                          <span class={`${prefixCls}__item-light`}>&nbsp;{title}&nbsp;</span>发布
                        </div>
                        <div class={[`${prefixCls}__item-cnte`, 'p-3']}>
                          <span class={`${prefixCls}__item-cnte__title`}> {cnteId}</span>
                          <br />
                          Status: {cnteStas}
                          <br />
                          Repository: {cnteRepo}
                          <br />
                        </div>
                      </div>
                    </List.Item.Meta>
                  </List.Item>
                );
              })}
            </List>
          </ScrollContainer>
        </CollapseContainer>
        // </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-news-list';
  .@{prefix-cls} {
    /deep/ .@{namespace}-collapse-container__body {
      height: 520px;
    }

    &__item {
      &-avatar {
        width: 28px;
        height: 28px;
      }

      &-title {
        font-size: 14px;
        line-height: 22px;
        color: #000;
        opacity: 0.65;
      }

      &-time {
        font-size: 14px;
        line-height: 22px;
        color: #000;
        opacity: 0.45;
      }

      &-light {
        font-size: 14px;
        line-height: 22px;
        color: #000;
        opacity: 0.85;
      }

      &-cnte {
        background: #eef3fb;
        border-radius: 2px;
        opacity: 0.6;

        &__title {
          font-size: 14px;
          line-height: 22px;
          color: #2c3a61;
        }
      }
    }
  }
</style>
