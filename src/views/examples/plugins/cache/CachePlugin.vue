<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Alert, Divider } from 'ant-design-vue';

  import { createStorage } from '@/utils/storage/index';

  import { useMessage } from '@/hooks/core/useMessage';
  export default defineComponent({
    name: 'CachePlugin',
    setup() {
      const { createMessage } = useMessage();

      // default
      const session = createStorage();

      // 可以用session直接操作cookie，这里只为了命名
      const cookieObj = session;
      const TEST_SESSION_KEY = 'test_session_key';
      const TEST_LOCAL_KEY = 'test_local_key';
      const TEST_COOKIE_KEY = 'test_cookie_key';
      //
      const local = createStorage(localStorage);
      return () => (
        <div class="p-4">
          <Alert
            message="使用插件进行缓存操作的好处"
            description="插件会自动对缓存增加key前缀,并且在生产模式会对内容进行aes对称加密,加深对数据的隐私保护！"
            type="info"
            show-icon
          />
          <Divider>SessionStorage 操作</Divider>

          <a-button
            onClick={() => {
              session.set(TEST_SESSION_KEY, 'test-value');
              createMessage.success(`已设置key:${TEST_SESSION_KEY},value:test-value`);
            }}
          >
            添加
          </a-button>
          <a-button
            class="mx-3"
            onClick={() => {
              const val = session.get(TEST_SESSION_KEY);
              createMessage.success(`key:${TEST_SESSION_KEY}的值为:` + val);
            }}
          >
            获取
          </a-button>
          <a-button
            onClick={() => {
              session.remove(TEST_SESSION_KEY);
              const val = session.get(TEST_SESSION_KEY);
              createMessage.success(`删除成功,key:${TEST_SESSION_KEY}的值为:` + val);
            }}
          >
            删除
          </a-button>
          <a-button
            class="mx-3"
            onClick={() => {
              session.clear();
              const val = session.get(TEST_SESSION_KEY);
              createMessage.success(`清空成功,key:${TEST_SESSION_KEY}的值为:` + val);
            }}
          >
            清空
          </a-button>

          <Divider>LocalStorage 操作</Divider>

          <a-button
            onClick={() => {
              local.set(TEST_LOCAL_KEY, 'test-value');
              createMessage.success(`已设置key:${TEST_LOCAL_KEY},value:test-value`);
            }}
          >
            添加
          </a-button>
          <a-button
            class="mx-3"
            onClick={() => {
              const val = local.get(TEST_LOCAL_KEY);
              createMessage.success(`key:${TEST_LOCAL_KEY}的值为:` + val);
            }}
          >
            获取
          </a-button>
          <a-button
            onClick={() => {
              local.remove(TEST_LOCAL_KEY);
              const val = local.get(TEST_LOCAL_KEY);
              createMessage.success(`删除成功,key:${TEST_LOCAL_KEY}的值为:` + val);
            }}
          >
            删除
          </a-button>
          <a-button
            class="mx-3"
            onClick={() => {
              local.clear();
              const val = local.get(TEST_LOCAL_KEY);
              createMessage.success(`清空成功,key:${TEST_LOCAL_KEY}的值为:` + val);
            }}
          >
            清空
          </a-button>

          <Divider>Cookie操作</Divider>

          <a-button
            onClick={() => {
              cookieObj.setCookie(TEST_COOKIE_KEY, 'test-value');
              createMessage.success(`已设置key:${TEST_COOKIE_KEY},value:test-value`);
            }}
          >
            添加
          </a-button>
          <a-button
            class="mx-3"
            onClick={() => {
              const val = cookieObj.getCookie(TEST_COOKIE_KEY);
              createMessage.success(`key:${TEST_COOKIE_KEY}的值为:` + val);
            }}
          >
            获取
          </a-button>
          <a-button
            onClick={() => {
              cookieObj.removeCookie(TEST_COOKIE_KEY);
              const val = cookieObj.getCookie(TEST_COOKIE_KEY);
              createMessage.success(`删除成功,key:${TEST_COOKIE_KEY}的值为:` + val);
            }}
          >
            删除
          </a-button>

          <a-button
            class="mx-3"
            onClick={() => {
              cookieObj.clearCookie();
              const val = cookieObj.getCookie(TEST_COOKIE_KEY);
              createMessage.success(`清空成功,key:${TEST_COOKIE_KEY}的值为:` + val);
            }}
          >
            清空
          </a-button>
        </div>
      );
    },
  });
</script>
