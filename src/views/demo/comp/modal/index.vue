<template>
  <PageWrapper title="modal组件使用示例">
    <Alert
      message="使用 useModal 进行弹窗操作，默认可以拖动，可以通过 draggable
    参数进行控制是否可以拖动/全屏，并演示了在Modal内动态加载内容并自动调整高度"
      show-icon
    />
    <a-button type="primary" class="my-4" @click="openModalLoading">
      打开弹窗,加载动态数据并自动调整高度(默认可以拖动/全屏)
    </a-button>

    <Alert message="内外同时同时显示隐藏" show-icon />
    <a-button type="primary" class="my-4" @click="openModal2"> 打开弹窗 </a-button>

    <Alert message="自适应高度" show-icon />
    <Space>
      <a-button type="primary" class="my-4" @click="openModal3"> 打开弹窗 </a-button>
      <a-button type="primary" class="my-4" @click="openModal5"> 打开弹窗（BasicTable） </a-button>
    </Space>

    <Alert message="内外数据交互" show-icon />
    <a-button type="primary" class="my-4" @click="send"> 打开弹窗并传递数据 </a-button>

    <Alert message="使用动态组件的方式在页面内使用多个弹窗" show-icon />
    <Space>
      <a-button type="primary" class="my-4" @click="openTargetModal(1)"> 打开弹窗1 </a-button>
      <a-button type="primary" class="my-4" @click="openTargetModal(2)"> 打开弹窗2 </a-button>
      <a-button type="primary" class="my-4" @click="openTargetModal(3)"> 打开弹窗3 </a-button>
      <a-button type="primary" class="my-4" @click="openTargetModal(4)"> 打开弹窗4 </a-button>
    </Space>

    <Alert
      message="使用函数方式创建Prompt，适合较为简单的表单内容，如果需要弹出较为复杂的内容，请使用 Modal."
      show-icon
    />
    <a-button type="primary" class="my-4" @click="handleCreatePrompt"> Prompt </a-button>

    <component
      v-if="currentModal"
      :is="currentModal"
      v-model:open="modalOpen"
      :userData="userData"
    />

    <Modal1 @register="register1" :minHeight="100" />
    <Modal2 @register="register2" />
    <Modal3 @register="register3" />
    <Modal4 @register="register4" />
    <Modal5 @register="register5" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { shallowRef, ComponentOptions, ref, nextTick } from 'vue';
  import { Alert, Space, message } from 'ant-design-vue';
  import { useModal } from '@/components/Modal';
  import Modal1 from './Modal1.vue';
  import Modal2 from './Modal2.vue';
  import Modal3 from './Modal3.vue';
  import Modal4 from './Modal4.vue';
  import Modal5 from './Modal5.vue';
  import { PageWrapper } from '@/components/Page';
  import { type Nullable } from '@vben/types';
  import { createPrompt } from '@/components/Prompt';

  const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
  const [register1, { openModal: openModal1 }] = useModal();
  const [register2, { openModal: openModal2 }] = useModal();
  const [register3, { openModal: openModal3 }] = useModal();
  const [register4, { openModal: openModal4 }] = useModal();
  const [register5, { openModal: openModal5 }] = useModal();
  const modalOpen = ref<Boolean>(false);
  const userData = ref<any>(null);

  function send() {
    openModal4(true, {
      data: 'content',
      info: 'Info',
    });
  }
  function openModalLoading() {
    openModal1(true);
    // setModalProps({ loading: true });
    // setTimeout(() => {
    //   setModalProps({ loading: false });
    // }, 2000);
  }

  function openTargetModal(index: number) {
    switch (index) {
      case 1:
        currentModal.value = Modal1 as ComponentOptions;
        break;
      case 2:
        currentModal.value = Modal2 as ComponentOptions;
        break;
      case 3:
        currentModal.value = Modal3 as ComponentOptions;
        break;
      default:
        currentModal.value = Modal4 as ComponentOptions;
        break;
    }
    nextTick(() => {
      // `useModal` not working with dynamic component
      // passing data through `userData` prop
      userData.value = { data: Math.random(), info: 'Info222' };
      // open the target modal
      modalOpen.value = true;
    });
  }

  function handleCreatePrompt() {
    createPrompt({
      title: '请输入邮箱',
      required: true,
      label: '邮箱',
      defaultValue: '默认邮箱',
      onOK: async (email: string) => {
        message.success('填写的邮箱地址为' + email);
      },
      inputType: 'Input',
    });
  }
</script>
