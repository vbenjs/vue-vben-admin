<script lang="ts" setup>
import { ref } from 'vue';

import {
  DragVerify,
  type DragVerifyActionType,
  Page,
  type VerifyPassingData,
} from '@vben/common-ui';
import { Bell, Github } from '@vben/icons';

import { Button, Card, message } from 'ant-design-vue';

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
const el2 = ref<DragVerifyActionType>();
const el3 = ref<DragVerifyActionType>();
const el4 = ref<DragVerifyActionType>();
const el5 = ref<DragVerifyActionType>();
</script>

<template>
  <Page title="拖动校验示例">
    <Card>
      <div class="flex items-center justify-center p-4">
        <DragVerify ref="el1" @success="handleSuccess" />
        <Button class="ml-2" type="primary" @click="handleBtnClick(el1)">
          还原
        </Button>
      </div>
      <div class="flex items-center justify-center p-4">
        <DragVerify ref="el2" circle @success="handleSuccess" />
        <Button class="ml-2" type="primary" @click="handleBtnClick(el2)">
          还原
        </Button>
      </div>
      <div class="flex items-center justify-center p-4">
        <DragVerify
          ref="el3"
          :bar-style="{
            backgroundColor: '#018ffb',
          }"
          success-text="校验成功"
          text="拖动以进行校验"
          @success="handleSuccess"
        />
        <Button class="ml-2" type="primary" @click="handleBtnClick(el3)">
          还原
        </Button>
      </div>
      <div class="flex items-center justify-center p-4">
        <DragVerify ref="el4" @success="handleSuccess">
          <template #actionIcon="{ isPassing }">
            <Bell v-if="isPassing" />
            <Github v-else />
          </template>
        </DragVerify>
        <Button class="ml-2" type="primary" @click="handleBtnClick(el4)">
          还原
        </Button>
      </div>
      <div class="flex items-center justify-center p-4">
        <DragVerify ref="el5" @success="handleSuccess">
          <template #text="{ isPassing }">
            <template v-if="isPassing">
              <Bell />
              成功
            </template>
            <template v-else>
              拖动
              <Github />
            </template>
          </template>
        </DragVerify>
        <Button class="ml-2" type="primary" @click="handleBtnClick(el5)">
          还原
        </Button>
      </div>
    </Card>
  </Page>
</template>
