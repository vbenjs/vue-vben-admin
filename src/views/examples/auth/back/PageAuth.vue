<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { Button, Alert } from 'ant-design-vue';
  import CurrentAuthMode from '../CurrentAuthMode.vue';

  import { useAuth } from '@/hooks/core/useAuth';

  import { appStore } from '@/store/modules/app';

  import { AuthModeEnum } from '@/enums/appEnum';

  import { useMessage } from '@/hooks/core/useMessage';
  export default defineComponent({
    name: 'BackPageAuth',
    setup() {
      const { changeMenu } = useAuth();
      const { createMessage } = useMessage();

      function beforeClick() {
        const isBack = appStore.getProjCfg.authMode === AuthModeEnum.BACK;
        if (!isBack) {
          createMessage.error('请先切换到后台权限模式');
          return false;
        }
        return isBack;
      }
      return () => {
        return (
          <div class="p-4">
            <Alert
              class="my-5"
              message="目前mock了两组数据， id为1 和 2 具体返回的菜单可以在mock/sys/menu.js内查看"
              type="info"
              show-icon
            />
            <CurrentAuthMode />
            <p>点击后请查看左侧菜单变化</p>
            权限切换：
            <Button
              type="primary"
              class="mr-2"
              onClick={() => {
                if (beforeClick()) {
                  changeMenu('2');
                }
              }}
            >
              点击切换菜单权限(用户id为2)
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (beforeClick()) {
                  changeMenu('1');
                }
              }}
            >
              点击切换菜单权限(用户id为1,默认)
            </Button>
          </div>
        );
      };
    },
  });
</script>
