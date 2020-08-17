<script lang="tsx">
  import { defineComponent, ref, unref, Ref } from 'compatible-vue';
  import { RotateDragVerify, DragVerifyActionType, PassingData } from '@/components/verify/index';

  import { useMessage } from '@/hooks/core/useMessage';

  import headImg from '@/assets/images/header.jpg';

  type DragVerifyRef = DragVerifyActionType | null;
  export default defineComponent({
    setup() {
      const { createMessage } = useMessage();

      const el1Ref = ref<DragVerifyRef>(null);

      function handleBtnClick(elRef: Ref<DragVerifyRef>) {
        const el = unref(elRef);
        if (!el) {
          return;
        }
        el.resume();
      }

      function handleChange(data: PassingData) {
        const { time } = data;
        createMessage.success(`校验成功,耗时${time}秒`);
      }

      return () => (
        <div class="p-4 rotate-verify-demo">
          <div class="rotate-verify-demo__wrap">
            <RotateDragVerify ref={el1Ref} onSuccess={handleChange} src={headImg} />
            <a-button class="ml-4" type="primary" onClick={handleBtnClick.bind(null, el1Ref)}>
              还原
            </a-button>
          </div>
        </div>
      );
    },
  });
</script>

<style lang="less" scoped>
  .rotate-verify-demo {
    &__wrap {
      display: flex;
      padding: 20px 0;
      text-align: center;
      background: rgba(0, 0, 0, 0.7);
      justify-content: center;
      align-items: center;
    }
  }
</style>
