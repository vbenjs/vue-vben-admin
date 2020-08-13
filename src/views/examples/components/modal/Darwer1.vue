<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Drawer } from '@/components/drawer/index';
  export default defineComponent({
    name: 'Drawer1Demo',
    setup(_, { listeners }) {
      return () => (
        <Drawer title="全屏抽屉" on={listeners}>
          全屏抽屉
        </Drawer>
      );
    },
  });
</script>
