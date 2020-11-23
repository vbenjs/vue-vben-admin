<template>
  <div :class="prefixCls">
    <a-page-header title="卡片列表" :ghost="false">
      基于Vue Next, TypeScript, Ant Design实现的一套完整的企业级后台管理系统。
      <div :class="`${prefixCls}__link`">
        <a><Icon icon="bx:bx-paper-plane" color="#1890ff" /><span>开始</span></a>
        <a><Icon icon="carbon:warning" color="#1890ff" /><span>简介</span></a>
        <a><Icon icon="gg:loadbar-doc" color="#1890ff" /><span>文档</span></a>
      </div>
    </a-page-header>

    <div :class="`${prefixCls}__content`">
      <List>
        <a-row :gutter="16">
          <template v-for="(item, index) in list" :key="index">
            <a-col :span="6">
              <ListItem>
                <Card :hoverable="true" :class="`${prefixCls}__card`">
                  <div :class="`${prefixCls}__card-title`">
                    <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                    {{ item.title }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    基于Vue Next, TypeScript, Ant Design实现的一套完整的企业级后台管理系统
                  </div>
                </Card>
              </ListItem>
            </a-col>
          </template>
        </a-row>
      </List>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { List, Card } from 'ant-design-vue';
  import Icon from '/@/components/Icon/index';
  import { cardList } from './data';

  export default defineComponent({
    components: { Icon, List, ListItem: List.Item, Card },
    setup() {
      return {
        prefixCls: 'list-card',
        list: cardList,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-card {
    &__link {
      margin-top: 10px;
      font-size: 14px;

      a {
        margin-right: 30px;
      }

      span {
        margin-left: 5px;
      }
    }

    &__content {
      padding: 12px 24px;
      // background: #fff;
    }

    &__card {
      width: 100%;
      margin-bottom: -8px;

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);

        .icon {
          margin-top: -5px;
          margin-right: 10px;
          font-size: 38px !important;
        }
      }

      &-detail {
        padding-top: 10px;
        padding-left: 30px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
</style>
