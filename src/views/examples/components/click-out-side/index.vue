<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { ClickOutSide } from '@/components/click-out-side/index';
  export default defineComponent({
    setup() {
      const showRef = ref(false);
      return () => (
        <div class="click-out-side-demo p-4">
          <ClickOutSide onClickOutside={() => (showRef.value = false)}>
            <div class="click-out-side-demo-content" onClick={() => (showRef.value = true)}>
              {unref(showRef) ? '鼠标点击那部（点击边框外可以恢复）' : '点击该区域状态(初始状态)'}
            </div>
          </ClickOutSide>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .click-out-side-demo {
    width: 300px;

    &-content {
      width: 300px;
      height: 300px;
      padding: 10px;
      border: 1px solid @primary-color;
    }
  }
</style>
