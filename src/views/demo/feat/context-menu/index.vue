<template>
  <div class="p-4">
    <CollapseContainer title="Simple">
      <a-button type="primary" @contextmenu="handleContext">Right Click on me</a-button>
    </CollapseContainer>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { CollapseContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    components: { CollapseContainer },
    setup() {
      const [createContextMenu] = useContextMenu();
      const { createMessage } = useMessage();
      function handleContext(e: MouseEvent) {
        createContextMenu({
          event: e,
          items: [
            {
              label: 'New',
              icon: 'ant-design:plus-outlined',
              handler: () => {
                createMessage.success('click new');
              },
            },
            {
              label: 'Open',
              icon: 'ant-design:folder-open-filled',
              handler: () => {
                createMessage.success('click open');
              },
            },
          ],
        });
      }
      return { handleContext };
    },
  });
</script>
