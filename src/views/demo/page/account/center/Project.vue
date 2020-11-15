<template>
  <List :class="prefixCls">
    <Row :gutter="16">
      <template v-for="(item, index) in list" :key="index">
        <Col :span="6">
          <ListItem>
            <Card :hoverable="true" :class="`${prefixCls}__card`">
              <img :src="demoImg" />
              <div :class="`${prefixCls}__card-title`">
                {{ item.title }}
              </div>
              <div :class="`${prefixCls}__card-content`"> {{ item.content }}</div>
            </Card>
          </ListItem>
        </Col>
      </template>
    </Row>
  </List>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { List, Card, Row, Col } from 'ant-design-vue';
  import demoImg from '/@/assets/images/demo.png';
  import { projectList } from './data';

  export default defineComponent({
    components: {
      List,
      ListItem: List.Item,
      Card,
      Row,
      Col,
    },
    setup() {
      return {
        prefixCls: 'account-center-project',
        list: projectList,
        demoImg,
      };
    },
  });
</script>
<style lang="less" scoped>
  .account-center-project {
    &__card {
      width: 100%;

      /deep/ .ant-card-body {
        padding: 0 0 24px 0;
      }

      img {
        width: 100%;
        height: 100px;
      }

      &-title {
        margin: 5px 10px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }

      &-content {
        margin: 5px 10px;
      }
    }
  }
</style>
