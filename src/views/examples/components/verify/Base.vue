<script lang="tsx">
  import { defineComponent, ref, unref, Ref } from 'compatible-vue';
  import { BasicDragVerify, DragVerifyActionType, PassingData } from '@/components/verify/index';

  import { useMessage } from '@/hooks/core/useMessage';

  import { Icon } from '@/components/icon/index';

  type DragVerifyRef = DragVerifyActionType | null;
  export default defineComponent({
    name: 'BaseDragVerifyDemo',
    setup() {
      const { createMessage } = useMessage();

      const el1Ref = ref<DragVerifyRef>(null);
      const el2Ref = ref<DragVerifyRef>(null);
      const el3Ref = ref<DragVerifyRef>(null);
      const el4Ref = ref<DragVerifyRef>(null);
      const el5Ref = ref<DragVerifyRef>(null);

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
        <div class="p-4 ">
          <div class="base-verify-demo__wrap">
            <BasicDragVerify ref={el1Ref} onSuccess={handleChange} />
            <a-button class="ml-4" type="primary" onClick={handleBtnClick.bind(null, el1Ref)}>
              还原
            </a-button>
          </div>

          <div class="base-verify-demo__wrap">
            <BasicDragVerify ref={el2Ref} circle={true} onSuccess={handleChange} />
            <a-button class="ml-4" type="primary" onClick={handleBtnClick.bind(null, el2Ref)}>
              还原
            </a-button>
          </div>

          <div class="base-verify-demo__wrap">
            <BasicDragVerify
              ref={el3Ref}
              text="拖动以进行校验"
              successText="校验成功"
              barStyle={{
                background: '#018ffb',
              }}
              onSuccess={handleChange}
            />
            <a-button class="ml-4" type="primary" onClick={handleBtnClick.bind(null, el3Ref)}>
              还原
            </a-button>
          </div>

          <div class="base-verify-demo__wrap">
            <BasicDragVerify
              ref={el4Ref}
              onSuccess={handleChange}
              scopedSlots={{
                actionIcon: (isPassing) => {
                  return <Icon type={isPassing ? 'bug' : 'right'}></Icon>;
                },
              }}
            />
            <a-button class="ml-4" type="primary" onClick={handleBtnClick.bind(null, el4Ref)}>
              还原
            </a-button>
          </div>

          <div class="base-verify-demo__wrap">
            <BasicDragVerify
              ref={el5Ref}
              onSuccess={handleChange}
              scopedSlots={{
                text: (isPassing) => {
                  return isPassing ? (
                    <div>
                      <Icon type="bug"></Icon>
                      成功
                    </div>
                  ) : (
                    <div>
                      拖动
                      <Icon type="right"></Icon>
                    </div>
                  );
                },
              }}
            />
            <a-button class="ml-4" type="primary" onClick={handleBtnClick.bind(null, el5Ref)}>
              还原
            </a-button>
          </div>
        </div>
      );
    },
  });
</script>

<style lang="less" scoped>
  .base-verify-demo {
    &__wrap {
      display: flex;
      justify-content: center;
      padding: 20px;
      align-items: center;
      background: rgba(0, 0, 0, 0.7);
    }
  }
</style>
