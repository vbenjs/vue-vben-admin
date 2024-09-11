<template>
  <div>
    <slot name="insertFooter"></slot>
    <a-button v-bind="cancelButtonProps" @click="handleCancel" v-if="showCancelBtn">
      {{ cancelText }}
    </a-button>
    <slot name="centerFooter"></slot>
    <a-button
      :type="okType"
      @click="handleOk"
      :loading="confirmLoading"
      v-bind="okButtonProps"
      v-if="showOkBtn"
    >
      {{ okText }}
    </a-button>
    <slot name="appendFooter"></slot>
  </div>
</template>
<script lang="ts" setup>
  import { basicProps } from '../props';

  defineOptions({ name: 'BasicModalFooter' });

  defineProps(basicProps);

  const emit = defineEmits(['ok', 'cancel']);

  function handleOk(e: Event) {
    emit('ok', e);
  }

  function handleCancel(e: Event) {
    emit('cancel', e);
  }
</script>
