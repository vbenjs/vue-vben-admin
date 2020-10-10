<template>
  <div class="p-10">
    <div class="flex justify-center p-4 items-center bg-gray-700">
      <BasicDragVerify ref="el1" @success="handleSuccess" />
      <a-button color="primary" class="ml-2" @click="handleBtnClick(el1)">还原</a-button>
    </div>

    <div class="flex justify-center p-4 items-center bg-gray-700">
      <BasicDragVerify ref="el2" @success="handleSuccess" circle />
      <a-button color="primary" class="ml-2" @click="handleBtnClick(el2)">还原</a-button>
    </div>

    <div class="flex justify-center p-4 items-center bg-gray-700">
      <BasicDragVerify
        ref="el3"
        @success="handleSuccess"
        text="拖动以进行校验"
        successText="校验成功"
        :barStyle="{
          background: '#018ffb',
        }"
      />
      <a-button color="primary" class="ml-2" @click="handleBtnClick(el3)">还原</a-button>
    </div>

    <div class="flex justify-center p-4 items-center bg-gray-700">
      <BasicDragVerify ref="el4" @success="handleSuccess">
        <template #actionIcon="isPassing">
          <BugOutlined v-if="isPassing" />
          <RightOutlined v-else />
        </template>
      </BasicDragVerify>
      <a-button color="primary" class="ml-2" @click="handleBtnClick(el4)">还原</a-button>
    </div>

    <div class="flex justify-center p-4 items-center bg-gray-700">
      <BasicDragVerify ref="el5" @success="handleSuccess">
        <template #text="isPassing">
          <div v-if="isPassing">
            <BugOutlined />
            成功
          </div>
          <div v-else>
            拖动
            <RightOutlined />
          </div>
        </template>
      </BasicDragVerify>
      <a-button color="primary" class="ml-2" @click="handleBtnClick(el5)">还原</a-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDragVerify, DragVerifyActionType, PassingData } from '/@/components/Verify/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BugOutlined, RightOutlined } from '@ant-design/icons-vue';
  export default defineComponent({
    components: { BasicDragVerify, BugOutlined, RightOutlined },
    setup() {
      const { createMessage } = useMessage();
      const el1 = ref<RefInstanceType<DragVerifyActionType>>(null);
      const el2 = ref<RefInstanceType<DragVerifyActionType>>(null);
      const el3 = ref<RefInstanceType<DragVerifyActionType>>(null);
      const el4 = ref<RefInstanceType<DragVerifyActionType>>(null);
      const el5 = ref<RefInstanceType<DragVerifyActionType>>(null);

      function handleSuccess(data: PassingData) {
        const { time } = data;
        createMessage.success(`校验成功,耗时${time}秒`);
      }

      function handleBtnClick(elRef: RefInstanceType<DragVerifyActionType>) {
        if (!elRef) {
          return;
        }
        elRef.$.resume();
      }
      return {
        handleSuccess,
        el1,
        el2,
        el3,
        el4,
        el5,
        handleBtnClick,
      };
    },
  });
</script>
<style lang="less" scoped>
  .bg-gray-700 {
    background: #4a5568;
  }
</style>
