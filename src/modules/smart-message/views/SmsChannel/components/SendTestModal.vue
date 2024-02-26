<template>
  <BasicModal
    :title="t('smart.sms.channel.title.sendTest')"
    @register="registerModal"
    @ok="handleSendTest"
    :okText="t('smart.sms.channel.button.sendTest')"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useForm, BasicForm } from '@/components/Form';
  import { useMessage } from '@/hooks/web/useMessage';

  import { sendTestApi } from '../SmartSmsChannelManagerListView.api';

  const { t } = useI18n();
  const { createSuccessModal } = useMessage();

  let currentChannelId: number | null = null;

  /**
   * 发送测试
   */
  const handleSendTest = async () => {
    try {
      changeOkLoading(true);
      const formModel = getFieldsValue();
      const parameter: Record<string, any> = {
        channelId: currentChannelId,
        ...formModel,
        phoneNumberList: formModel.phoneNumberListStr.split(','),
      };
      if (parameter.templateParameter) {
        parameter.templateParameter = JSON.parse(parameter.templateParameter);
      }
      const sendResult = await sendTestApi(parameter);
      createSuccessModal({
        content: JSON.stringify(sendResult),
      });
      closeModal();
    } finally {
      changeOkLoading(false);
    }
  };

  const [registerModal, { changeOkLoading, closeModal }] = useModalInner((data) => {
    currentChannelId = data.channelId;
  });

  const [registerForm, { getFieldsValue }] = useForm({
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    colon: true,
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
    schemas: [
      {
        field: 'signName',
        label: t('smart.sms.channel.title.signName'),
        component: 'Input',
        required: true,
      },
      {
        field: 'template',
        label: t('smart.sms.channel.title.template'),
        component: 'Input',
        required: true,
      },
      {
        field: 'templateParameter',
        label: 'Data',
        component: 'InputTextArea',
      },
      {
        field: 'phoneNumberListStr',
        label: t('smart.sms.channel.title.phoneNumberList'),
        component: 'InputTextArea',
        required: true,
        componentProps: {
          placeholder: t('smart.sms.channel.message.phoneNumberList'),
        },
      },
    ],
  });
</script>

<style scoped></style>
