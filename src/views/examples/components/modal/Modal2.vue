<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicModal } from '@/components/modal/index';
  export default defineComponent({
    name: 'Modal2Demo',
    setup(_, { listeners }) {
      return () => (
        <BasicModal title="帮助弹窗" helpMessage={['提示1', '提示2']} on={listeners}>
          弹窗标题带帮助按钮，可以通过helpMessage传入数据
        </BasicModal>
      );
    },
  });
</script>
