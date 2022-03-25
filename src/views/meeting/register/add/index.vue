<template>
  <div class="p-4 bg-white">
    <div class="mb-2 font-medium text-lg">
      {{ meetingManager?.title || '无' }}
    </div>
    <Divider />
    <BasicForm @register="registerForm" @submit="handleSubmit" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import schemas from '../common/form-schemas';
  import { useRoute } from 'vue-router';
  import { Divider, message } from 'ant-design-vue';
  import { MeetingManagerItem } from '/@/api/meeting/model/managerModel';
  import { showMeetingManager } from '/@/api/meeting/manager';
  import { postMeetingRegister } from '/@/api/meeting/register';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';

  const { params } = useRoute();
  const loading = ref<boolean>(false);
  const meetingManager = ref<MeetingManagerItem>();
  const go = useGo();

  const [registerForm, { getFieldsValue }] = useForm({
    schemas,
    labelWidth: 80,
    fieldMapToTime: [
      ['register_time', ['register_start_time', 'register_end_time'], 'YYYY-MM-DD HH:mm:ss'],
    ],
    actionColOptions: {
      span: 24,
    },
    submitButtonOptions: {
      text: '提交',
      loading,
    },
    showResetButton: false,
  });

  function handleSubmit() {
    if (!params.id) return;
    loading.value = true;

    const data = {
      meeting_manager_id: params.id,
      ...getFieldsValue(),
    };

    postMeetingRegister(data)
      .then(() => {
        message.success('提交成功');
      })
      .catch(() => {
        message.error('提交失败');
      })
      .finally(() => (loading.value = false));
  }

  async function fetchData(id: string) {
    loading.value = true;
    await showMeetingManager(id).then((res) => {
      if (res.has_registered) {
        message.info('您已报名该会议');
        go(PageEnum.MEETING_MANAGER_SHOW + id);
      }
      meetingManager.value = res;
    });
    loading.value = false;
  }

  watch(
    () => params,
    (newParams) => {
      if (newParams && newParams?.id) {
        fetchData(params.id as string);
      }
    },
    { immediate: true },
  );
</script>

<style></style>
