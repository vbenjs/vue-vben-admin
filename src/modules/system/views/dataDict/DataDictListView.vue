<template>
  <div class="full-height page-container">
    <LayoutSeparate :show-line="false" first-size="60%" class="full-height">
      <template #first>
        <DataDictGroup @code-change="handleCodeChange" />
      </template>
      <template #second>
        <DataDictItem :dict-id="dictId" />
      </template>
    </LayoutSeparate>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import { LayoutSeparate } from '@/components/LayoutSeparate';

  import DataDictGroup from './DataDictGroup.vue';
  import DataDictItem from './DataDictItem.vue';

  /**
   * 数据字典页面
   */
  export default defineComponent({
    name: 'DataDictListView',
    components: {
      LayoutSeparate,
      DataDictGroup,
      DataDictItem,
    },
    setup() {
      const dictId = ref<number | undefined>();

      const handleCodeChange = (id: number) => {
        dictId.value = id;
      };
      return {
        dictId,
        handleCodeChange,
      };
    },
  });
</script>

<style scoped></style>
