<template>
  <List :class="prefixCls">
    <a-row :gutter="16">
      <template v-for="item in list" :key="item.title">
        <a-col :span="6">
          <ListItem>
            <Card :hoverable="true" :class="`${prefixCls}__card`">
              <div :class="`${prefixCls}__card-title`">
                <VbenIcon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                {{ item.title }}
              </div>
              <div :class="`${prefixCls}__card-num`">
                活跃用户：<span>{{ item.active }}</span> 万
              </div>
              <div :class="`${prefixCls}__card-num`">
                新增用户：<span>{{ item.new }}</span>
              </div>
              <VbenIcon
                :class="`${prefixCls}__card-download`"
                v-if="item.download"
                :icon="item.download"
              />
            </Card>
          </ListItem>
        </a-col>
      </template>
    </a-row>
  </List>
</template>
<script lang="ts">
  import { VbenIcon } from '@vben/icons';
  import { Card, Col, List, Row } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { applicationList } from './data';

  export default defineComponent({
    components: {
      List,
      ListItem: List.Item,
      Card,
      VbenIcon,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup() {
      return {
        prefixCls: 'account-center-application',
        list: applicationList,
      };
    },
  });
</script>
<style lang="less">
  .account-center-application {
    &__card {
      width: 100%;
      margin-bottom: -12px;

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: 500;

        .icon {
          margin-top: -5px;
          font-size: 22px;
        }
      }

      &-num {
        margin-left: 24px;
        color: @text-color-secondary;
        line-height: 36px;

        span {
          margin-left: 5px;
          font-size: 18px;
        }
      }

      &-download {
        float: right;
        color: @primary-color;
        font-size: 20px !important;
      }
    }
  }
</style>
