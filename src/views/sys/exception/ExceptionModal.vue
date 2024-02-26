<template>
  <Modal :z-index="10000" :open="computedModalVisible" :footer="null" @cancel="handleHideModal">
    <div class="exception-modal">
      <div class="exception-modal-body">
        <CloseCircleOutlined class="icon" />
        <span class="title">{{ t('app.title.exceptionTitle') }}</span>
        <div class="content">
          <span style="white-space: pre">NO: {{ computedNoList.join(' ') }}</span>
          <a-textarea
            v-model:value="model.feedbackMessage"
            style="margin-top: 10px"
            :placeholder="t('common.formValidate.enter')"
            :rows="5"
          />
        </div>
      </div>
      <div class="exception-modal-button">
        <a-button @click="handleHideModal">{{ t('common.button.cancel') }}</a-button>
        <a-button
          type="primary"
          :loading="submitLoading"
          style="margin-left: 5px"
          @click="handleSubmit"
        >
          {{ t('common.button.submit') }}
        </a-button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';

  import { CloseCircleOutlined } from '@ant-design/icons-vue';
  import { Modal } from 'ant-design-vue';

  import { useSystemExceptionStore } from '@/store/modules/exception';

  import { successMessage } from '@/utils/message/SystemNotice';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  export default defineComponent({
    name: 'ExceptionModal',
    components: {
      CloseCircleOutlined,
      Modal,
    },
    setup() {
      const { t } = useI18n();
      const systemExceptionStore = useSystemExceptionStore();
      const { modalVisible, noList } = storeToRefs(systemExceptionStore);

      const model = ref<any>({});
      const submitLoading = ref(false);
      /**
       * 隐藏弹窗
       */
      const handleHideModal = () => {
        systemExceptionStore.handleHideExceptionModal();
      };
      /**
       * 提交操作
       */
      const handleSubmit = async () => {
        submitLoading.value = true;
        try {
          await defHttp.post({
            service: ApiServiceEnum.SMART_SYSTEM,
            url: 'sys/exception/feedback',
            data: {
              idList: noList.value,
              ...model.value,
            },
          });
          handleHideModal();
          successMessage({
            message: t('common.message.submitSuccess'),
          });
        } catch (e) {
          console.log(e);
        } finally {
          submitLoading.value = false;
        }
      };
      return {
        computedModalVisible: modalVisible,
        handleHideModal,
        computedNoList: noList,
        model,
        handleSubmit,
        submitLoading,
        t,
      };
    },
  });
</script>

<style lang="less" scoped>
  .exception-modal {
    padding: 15px;

    &::after {
      content: '';
      display: block;
      clear: both;
    }

    .exception-modal-body {
      .icon {
        margin-right: 16px;
        color: red;
        font-size: 22px;
      }

      .title {
        display: inline;
        overflow: hidden;
        color: #000000d9;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.4;
      }

      .content {
        margin-top: 8px;
        font-size: 14px;
      }
    }

    .exception-modal-button {
      margin-top: 24px;
      float: right;
    }
  }
</style>
