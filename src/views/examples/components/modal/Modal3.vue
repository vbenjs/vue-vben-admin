<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicModal } from '@/components/modal/index';
  export default defineComponent({
    name: 'Modal3Demo',
    setup(_, { listeners }) {
      return () => (
        <BasicModal title="自适应弹窗" on={listeners}>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
          <p class="my-10">内容自适应屏幕高度，超出屏幕高度自动出现滚动条</p>
        </BasicModal>
      );
    },
  });
</script>
