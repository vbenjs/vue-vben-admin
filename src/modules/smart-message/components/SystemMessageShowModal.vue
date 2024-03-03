<template>
  <BasicModal :title="t('common.button.look')" @register="register" :minHeight="500" :width="800">
    <template #footer>
      <div></div>
    </template>
    <div>
      <div>
        <h2 class="message-title">{{ messageDataRef.title }}</h2>
        <div class="sub-title" v-if="computedMessagePriority !== null">
          <a-tag :color="computedMessagePriority.color">{{ computedMessagePriority.label }}</a-tag>
          <span class="sub-title-sender">
            {{ messageDataRef.sender?.fullName || messageDataRef.createBy }}
          </span>
          <span class="sub-title-sender">{{ messageDataRef.sendTime }}</span>
        </div>
      </div>
      <div v-html="messageDataRef.content"></div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, ref, unref } from 'vue';

  import { useModalInner, BasicModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getDetailByIdApi } from '../views/SystemMessage/SmartMessageSystemListView.api';
  import { getMessagePriorityEnum } from '@/modules/smart-message/SmartMessageConstants';

  const { t } = useI18n();

  const messagePriorityEnum = getMessagePriorityEnum(t);
  /**
   * 优先级计算属性
   */
  const computedMessagePriority = computed(() => {
    const enumList = messagePriorityEnum.filter(
      (item) => item.value === unref(messageDataRef).priority,
    );
    if (enumList.length > 0) {
      return enumList[0];
    }
    return null;
  });

  const messageDataRef = ref<any>({});

  const [register, { changeLoading }] = useModalInner(async ({ id }) => {
    try {
      changeLoading(true);
      messageDataRef.value = (await getDetailByIdApi(id)) || {};
    } finally {
      changeLoading(false);
    }
  });
</script>

<style lang="less" scoped>
  .message-title {
    margin: 0 0 14px;
    font-size: 22px;
    line-height: 1.4;
  }

  .sub-title {
    margin-bottom: 22px;
    font-size: 0;
    line-height: 20px;
    word-wrap: break-word;
    hyphens: auto;
  }

  .sub-title-sender {
    display: inline-block;
    margin: 0 10px 10px 0;
    font-size: 15px;
    vertical-align: middle;
    -webkit-tap-highlight-color: rgb(0 0 0 / 0%);
  }
</style>
