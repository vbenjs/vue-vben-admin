<script lang="ts" setup>
import { ref } from 'vue';

import {
  DragVerify,
  type DragVerifyActionType,
  Page,
  type VerifyPassingData,
} from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

function handleSuccess(data: VerifyPassingData) {
  const { time } = data;
  message.success(`校验成功,耗时${time}秒`);
}
function handleBtnClick(elRef?: DragVerifyActionType) {
  if (!elRef) {
    return;
  }
  elRef.resume();
}

const el1 = ref<DragVerifyActionType>();
</script>

<template>
  <Page title="拖动校验示例">
    <div class="flex items-center justify-center p-4">
      <DragVerify ref="el1" @success="handleSuccess" />
      <Button class="ml-2" type="primary" @click="handleBtnClick(el1)">
        还原
      </Button>
    </div>
  </Page>
</template>
