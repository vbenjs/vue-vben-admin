<template>
  <template v-if="deleted === 'Y'">
    <div>
      <span class="deleted mr-2">{{ barcode }}</span>
      <Tag>{{ getDeleteText }}</Tag>
    </div>
  </template>
  <template v-else>
    <span>{{ barcode }}</span>
  </template>
</template>
<script lang="ts" setup>
  import { ProductType } from '@/enums/productType';
  import { Tag } from 'ant-design-vue';
  import { computed } from 'vue';

  defineOptions({ name: 'Barcode' });

  interface Props {
    barcode: string;
    deleted: 'Y' | 'N';
    productType: ProductType;
  }
  const props = withDefaults(defineProps<Props>(), {
    deleted: 'N',
  });

  const getDeleteText = computed(() => {
    if (props.productType === 'PALLET') return '已拆托';
    if (props.productType === 'BOX') return '已拆箱';
    return '已删除';
  });
</script>
<style lang="less" scoped>
  .deleted {
    text-decoration: line-through;
    color: #c3c3c3;
  }
</style>
