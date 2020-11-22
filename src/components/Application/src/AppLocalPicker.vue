<template>
  <Dropdown
    :trigger="['click']"
    :dropMenuList="localeList"
    :selectedKeys="selectedKeys"
    @menuEvent="handleMenuEvent"
  >
    <GlobalOutlined class="app-locale" />
  </Dropdown>
</template>
<script lang="ts">
  import { defineComponent, ref, watchEffect, unref } from 'vue';

  import { Dropdown, DropMenu } from '/@/components/Dropdown';
  import { GlobalOutlined } from '@ant-design/icons-vue';

  import { useLocale } from '/@/hooks/web/useLocale';
  import { useLocaleSetting } from '/@/settings/use/useLocaleSetting';

  import { LocaleType } from '/@/locales/types';

  export default defineComponent({
    name: 'AppLocalPicker',
    components: { GlobalOutlined, Dropdown },
    setup() {
      const { localeList } = useLocaleSetting();
      const selectedKeys = ref<string[]>([]);

      const { changeLocale, getLang } = useLocale();

      watchEffect(() => {
        selectedKeys.value = [unref(getLang)];
      });

      function toggleLocale(lang: LocaleType | string) {
        changeLocale(lang as LocaleType);
        selectedKeys.value = [lang as string];
      }

      function handleMenuEvent(menu: DropMenu) {
        toggleLocale(menu.event as string);
      }

      return { localeList, handleMenuEvent, selectedKeys };
    },
  });
</script>

<style lang="less" scoped>
  .app-locale {
    cursor: pointer;
  }
</style>
