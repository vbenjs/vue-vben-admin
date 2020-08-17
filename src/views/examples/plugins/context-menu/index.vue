<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { useMessage } from '@/hooks/core/useMessage';
  import { useContextMenu } from '@/hooks/functions/useContextMenu';
  export default defineComponent({
    setup() {
      const { createMessage } = useMessage();

      const [createContextMenu] = useContextMenu();
      function handler(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        createContextMenu({
          event: e,
          items: [
            {
              icon: 'redo',
              label: '选项1',
              handler: () => {
                createMessage.success('点击了选项1');
              },
            },
            {
              icon: 'redo',
              label: '选项2',
              handler: () => {
                createMessage.success('点击了选项2');
              },
            },
            {
              icon: 'redo',
              label: '选项3',
              handler: () => {
                createMessage.success('点击了选项3');
              },
            },
          ],
        });
      }
      return () => (
        <div class="p-4 context-menu-demo">
          <div class="box1" onContextmenu={handler}>
            在该区域点击右键
          </div>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .context-menu-demo {
    .box1 {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      background: #ddd;
    }
  }
</style>
