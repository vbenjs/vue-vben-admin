<template>
  <div class="w-150 m-auto">
    <Result status="success" title="操作成功" sub-title="预计两小时内到账">
      <template #extra>
        <a-button type="primary" @click="emit('redo')"> 再转一笔 </a-button>
        <a-button> 查看账单 </a-button>
      </template>
    </Result>
    <div class="mt-6 px-6 py-8 bg-white">
      <Descriptions :column="1" class="mt-5">
        <Descriptions.Item label="付款账户"> ant-design@alipay.com </Descriptions.Item>
        <Descriptions.Item label="收款账户"> test@example.com </Descriptions.Item>
        <Descriptions.Item label="收款人姓名"> Vben </Descriptions.Item>
        <Descriptions.Item label="转账金额"> 500元 </Descriptions.Item>
      </Descriptions>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Result, Descriptions } from 'ant-design-vue';

  const emit = defineEmits(['redo']);
</script>
