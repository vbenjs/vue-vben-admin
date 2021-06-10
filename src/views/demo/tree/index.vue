<template>
  <PageWrapper title="Tree基础示例">
    <div class="flex">
      <BasicTree
        :treeData="treeData"
        title="基础示例，默认展开第一层"
        defaultExpandLevel="1"
        class="w-1/3"
      />

      <BasicTree
        :treeData="treeData"
        title="可勾选，默认全部展开"
        :checkable="true"
        class="w-1/3 mx-4"
        defaultExpandAll
        @check="handleCheck"
      />

      <BasicTree
        title="指定默认展开/勾选示例"
        :treeData="treeData"
        :checkable="true"
        :expandedKeys="['0-0']"
        :checkedKeys="['0-0']"
        class="w-1/3"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTree } from '/@/components/Tree/index';
  import { treeData } from './data';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { BasicTree, PageWrapper },
    setup() {
      function handleCheck(checkedKeys, e) {
        console.log('onChecked', checkedKeys, e);
      }
      return { treeData, handleCheck };
    },
  });
</script>
