<template>
  <List :class="prefixCls">
    <Row :gutter="16">
      <template v-for="item in projectList" :key="item.title">
        <Col :span="6">
          <ListItem>
            <Card :hoverable="true" :class="`${prefixCls}__card`">
              <img :src="demoImg" />
              <div :class="`${prefixCls}__card-title`">
                {{ item.title }}
              </div>
              <div :class="`${prefixCls}__card-content`">
                {{ item.content }}
              </div>
            </Card>
          </ListItem>
        </Col>
      </template>
    </Row>
  </List>
</template>
<script lang="ts" setup>
  import { List, Card, Row, Col } from 'ant-design-vue';
  import demoImg from '@/assets/images/demo.png';
  import { projectList } from './data';

  const ListItem = List.Item;

  const prefixCls = 'account-center-project';
</script>
<style lang="less">
  .account-center-project {
    &__card {
      width: 100%;

      .ant-card-body {
        padding: 0 0 24px;
      }

      img {
        width: 100%;
        height: 130px;
      }

      &-title {
        margin: 5px 10px;
        color: rgb(0 0 0 / 85%);
        font-size: 16px;
        font-weight: 500;
      }

      &-content {
        margin: 5px 10px;
      }
    }
  }
</style>
