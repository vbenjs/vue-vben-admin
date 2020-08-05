<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Alert } from 'ant-design-vue';
  export default defineComponent({
    name: 'ComponentBaseDemo',
    setup() {
      return () => (
        <div class="p-4">
          <Alert
            message="温馨提醒"
            description="基础组件依赖于 ant-design-vue,组件库已有的基础组件,项目中不会再次进行demo展示（二次封装组件除外）"
            type="info"
            show-icon
          />
          <a-button
            type="primary"
            class="my-4"
            onClick={() => {
              window.open('https://www.antdv.com/docs/vue/introduce-cn/', '__blank');
            }}
          >
            点击跳转 Ant Design Vue 组件库文档
          </a-button>
        </div>
      );
    },
  });
</script>
