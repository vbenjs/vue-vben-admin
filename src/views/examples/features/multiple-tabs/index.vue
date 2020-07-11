<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Input, Button } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import { useTabs } from '@/hooks/functions/useTabs';
  export default defineComponent({
    name: 'MultipleTabs',
    setup() {
      const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTabs();
      return () => (
        <div>
          <CollapseContainer title="1.在下面输入框输入还存在，切换页面后内容还存在" class="mb-3">
            <Input />
          </CollapseContainer>
          <CollapseContainer title="2. 标签页操作">
            <Button.Group>
              <Button onClick={closeAll}>关闭所有标签</Button>
              <Button onClick={closeLeft}>关闭左侧标签</Button>
              <Button onClick={closeRight}>关闭右侧标签</Button>
              <Button onClick={closeOther}>关闭其他标签</Button>
              <Button onClick={closeCurrent}>关闭当前标签</Button>
              <Button onClick={refreshPage}>刷新当前页</Button>
            </Button.Group>
          </CollapseContainer>
        </div>
      );
    },
  });
</script>
