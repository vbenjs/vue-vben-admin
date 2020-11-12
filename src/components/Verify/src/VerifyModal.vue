<script lang="tsx">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal } from '/@/components/Modal/index';
  import { useTimeoutFn } from '@vueuse/core';

  import { RotateDragVerify, DragVerifyActionType } from '/@/components/Verify/index';
  export default defineComponent({
    name: 'VerifyModal',

    setup(_, { attrs, emit }) {
      const dragRef = ref<DragVerifyActionType | null>(null);

      function handleSuccess() {
        useTimeoutFn(() => {
          emit('success');
          const dragEl = unref(dragRef);
          if (dragEl) {
            dragEl.resume();
          }
        }, 500);
      }
      return () => (
        <BasicModal
          {...attrs}
          title="安全校验"
          keyboard={false}
          maskClosable={false}
          canFullscreen={false}
          footer={null}
          wrapperFooterOffset={60}
          destroyOnClose={true}
        >
          <RotateDragVerify
            imgWidth={210}
            ref={dragRef}
            text="请拖动滑块将图片摆正"
            {...attrs}
            onSuccess={handleSuccess}
          />
        </BasicModal>
      );
    },
  });
</script>
