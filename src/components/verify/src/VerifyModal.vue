<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { BasicModal } from '@/components/modal/index';
  import { useTimeout } from '@/hooks/core/useTimeout';

  import { RotateDragVerify, DragVerifyActionType } from '@/components/verify/index';
  export default defineComponent({
    name: 'VerifyModal',

    setup(_, { listeners, attrs, emit }) {
      // const { createMessage } = useMessage();

      const dragRef = ref<DragVerifyActionType | null>(null);

      function handleSuccess() {
        // createMessage.success(`校验成功,耗时${time}秒！`);
        useTimeout(() => {
          emit('success');
          const dragEl = unref(dragRef);
          if (dragEl) {
            dragEl.resume();
          }
        }, 500);
      }
      return () => (
        <BasicModal
          title="安全校验"
          keyboard={false}
          maskClosable={false}
          on={listeners}
          canFullscreen={false}
          footer={null}
          wrapperFooterOffset={60}
          destroyOnClose={true}
        >
          <RotateDragVerify
            imgWidth={210}
            ref={dragRef}
            text="请拖动滑块将图片摆正"
            {...{ props: attrs }}
            onSuccess={handleSuccess}
          />
        </BasicModal>
      );
    },
  });
</script>
