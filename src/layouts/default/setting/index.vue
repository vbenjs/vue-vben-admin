<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';
  import { Icon } from '@/components/icon/index';
  import SettingDrawer from './SettingDrawer.vue';

  import { useDesign } from '@/hooks/core/useDesign';

  import { useDrawer } from '@/components/drawer/index';

  //
  export default defineComponent({
    name: 'SettingBtn',
    setup() {
      const { prefixCls } = useDesign('setting-btn');
      // 系统配置drawer
      const [getDrawer, { openDrawer, isFirstLoadRef }] = useDrawer();
      return () => (
        <div
          class={prefixCls}
          onClick={() => {
            openDrawer({
              visible: true,
            });
          }}
        >
          <Icon type="setting" spin={true} />
          {
            // <span>系统配置</span>
          }
          {!unref(isFirstLoadRef) && <SettingDrawer onRegister={getDrawer} />}
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-setting-btn';

  .@{prefix-cls} {
    display: flex;
    padding: 16px;
    color: @white;
    cursor: pointer;
    background: @primary-color;
    flex-direction: column;
    border-radius: 10px 0 0 10px;

    i {
      font-size: 18px;
    }

    span {
      margin-top: 12px;
    }
  }
</style>
