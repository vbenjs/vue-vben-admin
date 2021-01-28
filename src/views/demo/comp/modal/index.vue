<template>
  <PageWrapper title="modal组件使用示例">
    <Alert
      message="使用 useModal 进行弹窗操作，默认可以拖动，可以通过 draggable
    参数进行控制是否可以拖动/全屏"
      show-icon
    />
    <a-button type="primary" class="my-4" @click="openModalLoading">
      打开弹窗 默认可以拖动/全屏
    </a-button>

    <Alert message="内外同时同时显示隐藏" show-icon />
    <a-button type="primary" class="my-4" @click="openModal2"> 打开弹窗 </a-button>
    <Alert message="自适应高度" show-icon />
    <a-button type="primary" class="my-4" @click="openModal3"> 打开弹窗 </a-button>

    <Alert
      message="内外数据交互,外部通过 transferModalData 发送，内部通过 receiveDrawerDataRef 接收。该数据具有响应式"
      show-icon
    />
    <a-button type="primary" class="my-4" @click="send"> 打开弹窗并传递数据 </a-button>

    <Modal1 @register="register1" />
    <Modal2 @register="register2" />
    <Modal3 @register="register3" />
    <Modal4 @register="register4" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Alert } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import Modal1 from './Modal1.vue';
  import Modal2 from './Modal2.vue';
  import Modal3 from './Modal3.vue';
  import Modal4 from './Modal4.vue';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { Alert, Modal1, Modal2, Modal3, Modal4, PageWrapper },
    setup() {
      const [register1, { openModal: openModal1, setModalProps }] = useModal();
      const [register2, { openModal: openModal2 }] = useModal();
      const [register3, { openModal: openModal3 }] = useModal();
      const [register4, { openModal: openModal4 }] = useModal();
      function send() {
        openModal4(true, {
          data: 'content',
          info: 'Info',
        });
      }
      function openModalLoading() {
        openModal1();
        setModalProps({ loading: true });
        setTimeout(() => {
          setModalProps({ loading: false });
        }, 2000);
      }
      return {
        register1,
        openModal1,
        register2,
        openModal2,
        register3,
        openModal3,
        register4,
        openModal4,
        send,
        openModalLoading,
      };
    },
  });
</script>
