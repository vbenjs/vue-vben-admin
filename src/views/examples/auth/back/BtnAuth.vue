<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Authority } from '@/components/authority/index';
  import { Button, Alert, Divider } from 'ant-design-vue';
  import CurrentAuthMode from '../CurrentAuthMode.vue';

  import { useAuth } from '@/hooks/core/useAuth';

  import { appStore } from '@/store/modules/app';
  import { permissionStore } from '@/store/modules/permission';

  import { AuthModeEnum } from '@/enums/appEnum';

  import { useMessage } from '@/hooks/core/useMessage';
  import { getBtnCodeListByUserId } from '@/api/sys/menu';
  export default defineComponent({
    name: 'BackPageAuth',
    setup() {
      const { hasCodeAuth } = useAuth();
      const { createMessage } = useMessage();

      function beforeClick() {
        const isBack = appStore.getProjCfg.authMode === AuthModeEnum.BACK;
        if (!isBack) {
          createMessage.error('请先切换到后台权限模式');
          return false;
        }
        return isBack;
      }

      // !模拟从后台获取权限编码， 该函数可能只需要执行一次，实际项目可以自行放到合适的时机
      async function initPermissionCode(userId: string) {
        const codeList = await getBtnCodeListByUserId({ userId });
        permissionStore.commitPermCodeListState(codeList);
      }
      // 默认初始化为1
      initPermissionCode('1');
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
            当前拥有的code列表： {permissionStore.getPermCodeListState.toString()}
            <Divider />
            权限切换：
            <Button
              type="primary"
              class="mr-2"
              onClick={() => {
                if (beforeClick()) {
                  initPermissionCode('2');
                }
              }}
            >
              点击切换按钮权限(用户id为2)
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (beforeClick()) {
                  initPermissionCode('1');
                }
              }}
            >
              点击切换按钮权限(用户id为1,默认)
            </Button>
            <Divider />
            <p>点击后请查看下方按钮变化</p>
            <Divider />
            <div class="p-10">
              <h1>组件方式控制</h1>

              <Authority authMode={AuthModeEnum.BACK} code="10000">
                <Button type="primary" block>
                  拥有code: 10000可见
                </Button>
              </Authority>
              <Authority class="my-3" authMode={AuthModeEnum.BACK} code="20000">
                <Button type="primary" block>
                  拥有code: 20000可见
                </Button>
              </Authority>
              <Authority class="my-3" authMode={AuthModeEnum.BACK} code="20020">
                <Button type="primary" block>
                  拥有code: 20020可见
                </Button>
              </Authority>
              <h1>函数方式控制</h1>
              <h3>主要用于不适合写标签的地方,如 tabs可以用遍历过滤进行生成</h3>

              {hasCodeAuth('10000') && (
                <Button type="primary" block>
                  拥有code: 10000可见
                </Button>
              )}

              {hasCodeAuth('20000') && (
                <Button class="mt-5" type="primary" block>
                  拥有code: 20000可见
                </Button>
              )}

              {hasCodeAuth('20020') && (
                <Button class="mt-5" type="primary" block>
                  拥有code: 20020可见
                </Button>
              )}
            </div>
          </div>
        );
      };
    },
  });
</script>
