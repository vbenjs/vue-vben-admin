<script lang="tsx">
  import { defineComponent, computed, unref } from 'compatible-vue';
  import { List, Icon } from 'ant-design-vue';
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
                      提交人：{sbmter}&nbsp;&nbsp;提交时间：{sbmtTime}
                    </div>
                  </List.Item.Meta>
                  <a-button onClick={handleAppr.bind(item)} type="link">
                    待审批
                    <Icon type="down" />
                  </a-button>
                </List.Item>
              );
            })}
          </List>
          <div class={`${prefixCls}__all`}>
            查看全部
            <Icon type="right" />
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
    &__total {
      display: inline-block;
      width: 20px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      color: #000;
      text-align: center;
      background: rgba(140, 140, 140, 0.1);
      border-radius: 50%;
      opacity: 0.65;
    }

    &__all {
      height: 56px;
      line-height: 56px;
      text-align: center;
      background: #f9f9f9;
      border-radius: 0 0 2px 2px;
    }

    &__item {
      &-title {
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        color: #1c1d21;
      }

      &-memo {
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        color: #7c8087;
      }

      &-desc {
        font-size: 14px;
        line-height: 22px;
        color: #7c8087;
      }
    }
  }
</style>
