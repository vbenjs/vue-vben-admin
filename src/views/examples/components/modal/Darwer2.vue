<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Drawer, DrawerType } from '@/components/drawer/index';
  export default defineComponent({
    name: 'Drawer2Demo',
    setup(_, { listeners }) {
      return () => (
        <Drawer title="主体区域抽屉" on={listeners} drawerType={DrawerType.DETAIL}>
          主体区域抽屉
        </Drawer>
      );
    },
  });
</script>
