<template>
  <BasicDrawer
    :title="getTitle"
    v-bind="$attrs"
    @register="register"
    :width="640"
    destroyOnClose
    :maskClosable="true"
    showFooter
    @ok="handleSubmit"
    okText="更新"
  >
    <div v-if="contentData.messageType === 'EMAIL'">
      <Tinymce v-model="contentData.content" :showImageUpload="false" />
    </div>
    <div v-else>
      <CodeEditor v-model:value="contentData.content" :mode="MODE.JSON" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { computed, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { updateRemindMessageContent } from '@/api/remind/message';
  import { Tinymce } from '@/components/Tinymce';

  const contentData = reactive({
    id: 0,
    content: '',
    messageType: '',
  });

  defineEmits(['success', 'register']);

  const getTitle = computed(() => {
    return '更新内容';
  });

  const [register, { closeDrawer }] = useDrawerInner(async (data) => {
    contentData.id = data.id;
    contentData.content = data.content;
    contentData.messageType = data.messageType;
  });

  async function handleSubmit() {
    try {
      await updateRemindMessageContent(contentData.id, contentData.content);
      message.success('更新成功！');
      closeDrawer();
    } finally {
      /* empty */
    }
  }
</script>
