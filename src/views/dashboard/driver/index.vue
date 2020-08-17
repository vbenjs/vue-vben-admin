<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { useStepsDriver } from '@/hooks/functions/useDriver';

  export default defineComponent({
    setup() {
      const { startDriver } = useStepsDriver([
        {
          element: '#elem-driver-trigger',
          popover: {
            title: '收起菜单栏',
            description: '',
          },
        },
        {
          element: '#elem-driver-action-github',
          popover: {
            title: '获取帮助',
            description: '',
          },
        },
        {
          element: '#elem-driver-action-refresh',
          popover: {
            title: '刷新页面',
            description: '',
          },
        },
        {
          element: '#elem-driver-setting-btn',
          popover: {
            title: '更改系统配置',
            description: '',
            position: 'left',
          },
        },
      ]);

      return () => (
        <div>
          <div id="start-driver" class="m-4">
            本demo是基于
            <a href="https://github.com/kamranahmedse/driver.js" target="_blank">
              driver.js.
            </a>
          </div>
          <a-button onClick={startDriver} class="m-4">
            开始引导
          </a-button>
        </div>
      );
    },
  });
</script>
