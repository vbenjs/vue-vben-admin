<template>
  <PageWrapper title="Tree基础示例">
    <div class="flex">
      <CollapseContainer title="基础示例" :style="{ width: '33%' }" class="mr-4">
        <BasicTree :treeData="treeData" />
      </CollapseContainer>

      <CollapseContainer title="可勾选" class="mr-4" :style="{ width: '33%' }">
        <BasicTree :treeData="treeData" :checkable="true" />
      </CollapseContainer>

      <CollapseContainer title="默认展开/勾选示例" :style="{ width: '33%' }">
        <BasicTree
          :treeData="treeData"
          :checkable="true"
          :expandedKeys="['0-0']"
          :checkedKeys="['0-0']"
        />
      </CollapseContainer>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTree } from '/@/components/Tree/index';
  import { treeData } from './data';
  import { CollapseContainer } from '/@/components/Container/index';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { BasicTree, CollapseContainer, PageWrapper },
    setup() {
      return { treeData };
    },
  });
</script>
