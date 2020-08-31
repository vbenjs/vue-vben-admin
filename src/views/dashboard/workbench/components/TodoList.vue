<script lang="tsx">
  import { defineComponent, computed, unref } from 'compatible-vue';
  import { List, Icon, Tag, Tooltip } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import { useDesign } from '@/hooks/core/useDesign';

  import { wokbStore } from '../store';
  import { TodoItem } from '@/api/dashboard/model/wokbModel';

  export default defineComponent({
    name: 'TodoList',
    setup() {
      const { prefixCls } = useDesign('todo-list');
      const getTodoList = computed(() => {
        return wokbStore.getTodoList.slice(0, 3);
      });
      function handleAppr(item: TodoItem) {
        console.log(item);
      }

      return () => (
        <CollapseContainer class={prefixCls} canExpan={false}>
          <span slot="title">
            待办事项 <span class={`${prefixCls}__total`}>{wokbStore.getTodoTotal}</span>
          </span>
          <List>
            {unref(getTodoList).map((item) => {
              const { id, sbmter, sbmtTime, title, memo } = item;
              return (
                <List.Item key={id} class={`${prefixCls}__item`}>
                  <List.Item.Meta>
                    <div slot="title">
                      <span class={`${prefixCls}__item-title`}>{title}</span>
                      <span class={`${prefixCls}__item-memo`}>{memo}</span>
                    </div>
                    <div slot="description" class={`${prefixCls}__item-desc`}>
                      提交人：{sbmter}
                      <br />
                      提交时间：{sbmtTime}
                    </div>
                  </List.Item.Meta>
                  <a-button onClick={handleAppr.bind(item)} type="link">
                    <Tag color="blue">待审批</Tag>
                  </a-button>
                </List.Item>
              );
            })}
          </List>
          <div class={`${prefixCls}__all`}>
            <Tooltip placement="topRight">
              <template slot="title">查看更多</template>
              <Icon type="ellipsis" />
            </Tooltip>
          </div>
        </CollapseContainer>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-todo-list';
  .@{prefix-cls} {
    // padding: 24px;
    // background: #fff;
    position: relative;

    &__total {
      display: inline-block;
      width: 20px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      color: #fff;
      text-align: center;
      background: rgba(255, 0, 0, 0.7);
      border-radius: 50%;
    }

    &__all {
      position: absolute;
      top: 0;
      right: 10px;
      height: 56px;
      font-size: 24px;
      line-height: 56px;
      text-align: center;
      cursor: pointer;
    }

    &__item {
      padding: 8px 0;

      &-title {
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        color: #1c1d21;
      }

      &-memo {
        font-size: 12px;
        font-weight: normal;
        line-height: 22px;
        color: #7c8087;
      }

      &-desc {
        font-size: 12px;
        line-height: 22px;
        color: #7c8087;
      }
    }
  }
</style>
