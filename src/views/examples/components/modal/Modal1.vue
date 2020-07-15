<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicModal } from '@/components/modal/index';
  export default defineComponent({
    name: 'Modal1Demo',
    setup(_, { listeners }) {
      return () => (
        <BasicModal title="基础弹窗" on={listeners}>
          弹窗可以拖动
        </BasicModal>
      );
    },
  });
</script>
