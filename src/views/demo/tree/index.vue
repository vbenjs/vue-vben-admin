<template>
  <div class="flex p-4">
    <CollapseContainer title="基础示例" class="w-1/3 mr-4">
      <BasicTree :treeData="treeData" />
    </CollapseContainer>

    <CollapseContainer title="可勾选" class="w-1/3 mr-4">
      <BasicTree :treeData="treeData" :checkable="true" />
    </CollapseContainer>

    <CollapseContainer title="默认展开/勾选示例" class="w-1/3">
      <BasicTree
        :treeData="treeData"
        :checkable="true"
        :expandedKeys="['0-0']"
        :checkedKeys="['0-0']"
      />
    </CollapseContainer>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTree } from '/@/components/Tree/index';
  import { treeData } from './data';
  import { CollapseContainer } from '/@/components/Container/index';

  export default defineComponent({
    components: { BasicTree, CollapseContainer },
    setup() {
      return { treeData };
    },
  });
</script>
