<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { appStore } from '@/store/modules/app';
  import { Divider } from 'ant-design-vue';
  import { useAuth } from '@/hooks/core/useAuth';
  import { AuthModeEnum } from '@/enums/appEnum';

  export default defineComponent({
    name: 'CurrentAuthMode',
    setup() {
      const { toggleAuthMode } = useAuth();

      return () => (
        <div>
          当前权限模式：
          {appStore.getProjCfg.authMode === AuthModeEnum.BACK ? '后台权限模式' : '前端权限模式'}
          <a-button class="ml-4" onClick={toggleAuthMode}>
            切换权限模式
          </a-button>
          <Divider />
        </div>
      );
    },
  });
</script>
