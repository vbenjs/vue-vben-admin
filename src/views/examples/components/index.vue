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

          <Alert message="按钮扩展" type="info" show-icon />

          <div class="my-2">
            <h3>success</h3>
            <a-button color="success">成功按钮</a-button>
            <a-button color="success" class="ml-2" disabled>
              禁用按钮
            </a-button>
            <a-button color="success" class="ml-2" loading>
              loading按钮
            </a-button>
            <a-button color="success" type="link" class="ml-2">
              loading按钮
            </a-button>
            <a-button color="success" type="link" class="ml-2" loading>
              loading link按钮
            </a-button>
            <a-button color="success" type="link" class="ml-2" disabled>
              loading link按钮
            </a-button>
          </div>

          <div class="my-2">
            <h3>warning</h3>
            <a-button color="warning">警告按钮</a-button>
            <a-button color="warning" class="ml-2" disabled>
              禁用按钮
            </a-button>
            <a-button color="warning" class="ml-2" loading>
              loading按钮
            </a-button>
            <a-button color="warning" type="link" class="ml-2">
              loading按钮
            </a-button>
            <a-button color="warning" type="link" class="ml-2" loading>
              loading link按钮
            </a-button>
            <a-button color="warning" type="link" class="ml-2" disabled>
              loading link按钮
            </a-button>
          </div>
          <div class="my-2">
            <h3>error</h3>
            <a-button color="error">错误按钮</a-button>
            <a-button color="error" class="ml-2" disabled>
              禁用按钮
            </a-button>
            <a-button color="error" class="ml-2" loading>
              loading按钮
            </a-button>
            <a-button color="error" type="link" class="ml-2">
              loading按钮
            </a-button>
            <a-button color="error" type="link" class="ml-2" loading>
              loading link按钮
            </a-button>
            <a-button color="error" type="link" class="ml-2" disabled>
              loading link按钮
            </a-button>
          </div>
          <div class="my-2">
            <h3>ghost</h3>
            <a-button ghost>幽灵按钮</a-button>
            <a-button ghost class="ml-2" disabled>
              禁用按钮
            </a-button>
            <a-button ghost class="ml-2" loading>
              loading按钮
            </a-button>
            <a-button ghost type="link" class="ml-2">
              loading按钮
            </a-button>
            <a-button ghost type="link" class="ml-2" loading>
              loading link按钮
            </a-button>
            <a-button ghost type="link" class="ml-2" disabled>
              loading link按钮
            </a-button>
          </div>
          <div class="my-2">
            <h3>primary</h3>
            <a-button type="primary">主按钮</a-button>
            <a-button type="primary" class="ml-2" disabled>
              禁用按钮
            </a-button>
            <a-button type="primary" class="ml-2" loading>
              loading按钮
            </a-button>
            <a-button type="link" class="ml-2">
              loading按钮
            </a-button>
            <a-button type="link" class="ml-2" loading>
              loading link按钮
            </a-button>
            <a-button type="link" class="ml-2" disabled>
              loading link按钮
            </a-button>
          </div>

          <div class="my-2">
            <h3>default</h3>
            <a-button type="default">默认按钮</a-button>
            <a-button type="default" class="ml-2" disabled>
              禁用按钮
            </a-button>
            <a-button type="default" class="ml-2" loading>
              loading按钮
            </a-button>
            <a-button type="link" class="ml-2">
              loading按钮
            </a-button>
            <a-button type="link" class="ml-2" loading>
              loading link按钮
            </a-button>
            <a-button type="link" class="ml-2" disabled>
              loading link按钮
            </a-button>
          </div>
          <div class="my-2">
            <h3>dashed</h3>
            <a-button type="dashed">dashed按钮</a-button>
            <a-button type="dashed" class="ml-2" disabled>
              禁用按钮
            </a-button>
            <a-button type="dashed" class="ml-2" loading>
              loading按钮
            </a-button>
          </div>
        </div>
      );
    },
  });
</script>
