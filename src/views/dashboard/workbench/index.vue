<script lang="tsx">
  import { defineComponent, onMounted } from 'compatible-vue';
  import { Row, Col } from 'ant-design-vue';
  import ProdTotal from './components/ProdTotal.vue';
  import TodoList from './components/TodoList.vue';
  import DplyList from './components/DplyList.vue';
  import NewsList from './components/NewsList.vue';
  import wokbImg from '@/assets/images/dashboard/wokb/wokb.png';
  import ShortCuts from './components/ShortCuts.vue';

  import FileList from './components/FileList.vue';
  import AnnoList from './components/AnnoList.vue';

  import { useDesign } from '@/hooks/core/useDesign';
  import { wokbStore } from './store';
  export default defineComponent({
    setup() {
      const { prefixCls } = useDesign('workbench');
      onMounted(() => {
        // 请求首页数据
        wokbStore.loadAction();
      });
      return () => (
        <Row class={prefixCls} gutter={12}>
          <Col md={24} lg={17}>
            <ProdTotal class="mb-3" />
            <TodoList class="mb-3" />
            <DplyList class="mb-3" />
            <NewsList />
          </Col>
          <Col md={24} lg={7}>
            <img src={wokbImg} class={[`${prefixCls}__wokb-img`, 'mb-3']} />
            <ShortCuts class="mb-3" />
            <FileList class="mb-3" />
            <AnnoList />
          </Col>
        </Row>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-workbench';
  .@{prefix-cls} {
    padding: 16px;

    &__wokb-img {
      width: 100%;
      height: 172px;
    }
  }
</style>
