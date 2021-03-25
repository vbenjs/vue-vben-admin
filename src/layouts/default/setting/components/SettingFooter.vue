<template>
  <div :class="prefixCls">
    <a-button type="primary" block @click="handleCopy">
      <CopyOutlined class="mr-2" />
      {{ t('layout.setting.copyBtn') }}
    </a-button>

    <a-button color="warning" block @click="handleResetSetting" class="my-3">
      <RedoOutlined class="mr-2" />
      {{ t('common.resetText') }}
    </a-button>

    <a-button color="error" block @click="handleClearAndRedo">
      <RedoOutlined class="mr-2" />
      {{ t('layout.setting.clearBtn') }}
    </a-button>
  </div>
</template>
<script lang="ts">
  import { defineComponent, unref } from 'vue';

  import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';

  import { appStore } from '/@/store/modules/app';
  import { permissionStore } from '/@/store/modules/permission';
  import { tabStore } from '/@/store/modules/tab';
  import { userStore } from '/@/store/modules/user';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
  import { updateGrayMode } from '/@/logics/theme/updateGrayMode';

  import defaultSetting from '/@/settings/projectSetting';
  export default defineComponent({
    name: 'SettingFooter',
    components: { CopyOutlined, RedoOutlined },
    setup() {
      const { getRootSetting } = useRootSetting();
      const { prefixCls } = useDesign('setting-footer');
      const { t } = useI18n();
      const { createSuccessModal, createMessage } = useMessage();

      function handleCopy() {
        const { isSuccessRef } = useCopyToClipboard(JSON.stringify(unref(getRootSetting), null, 2));
        unref(isSuccessRef) &&
          createSuccessModal({
            title: t('layout.setting.operatingTitle'),
            content: t('layout.setting.operatingContent'),
          });
      }
      function handleResetSetting() {
        try {
          appStore.commitProjectConfigState(defaultSetting);
          const { colorWeak, grayMode } = defaultSetting;
          // updateTheme(themeColor);
          updateColorWeak(colorWeak);
          updateGrayMode(grayMode);
          createMessage.success(t('layout.setting.resetSuccess'));
        } catch (error) {
          createMessage.error(error);
        }
      }

      function handleClearAndRedo() {
        localStorage.clear();
        appStore.resumeAllState();
        permissionStore.commitResetState();
        tabStore.commitResetState();
        userStore.commitResetState();
        location.reload();
      }
      return {
        prefixCls,
        t,
        handleCopy,
        handleResetSetting,
        handleClearAndRedo,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-footer';

  .@{prefix-cls} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
