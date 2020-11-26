<template>
  <Dropdown
    :trigger="['click']"
    :dropMenuList="localeList"
    :selectedKeys="selectedKeys"
    @menuEvent="handleMenuEvent"
    overlayClassName="app-locale-picker-overlay"
  >
    <span class="app-local-picker">
      <GlobalOutlined class="app-local-picker__icon" />
      <span v-if="showText">{{ getLangText }}</span>
    </span>
  </Dropdown>
</template>
<script lang="ts">
  import { defineComponent, ref, watchEffect, unref, computed } from 'vue';

  import { Dropdown, DropMenu } from '/@/components/Dropdown';
  import { GlobalOutlined } from '@ant-design/icons-vue';

  import { useLocale } from '/@/hooks/web/useLocale';
  import { useLocaleSetting } from '/@/hooks/setting/useLocaleSetting';

  import { LocaleType } from '/@/locales/types';

  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'AppLocalPicker',
    components: { GlobalOutlined, Dropdown },
    props: {
      // Whether to display text
      showText: propTypes.bool.def(true),
      // Whether to refresh the interface when changing
      reload: propTypes.bool,
    },
    setup(props) {
      const { localeList } = useLocaleSetting();
      const selectedKeys = ref<string[]>([]);

      const { changeLocale, getLang } = useLocale();

      const getLangText = computed(() => {
        const key = selectedKeys.value[0];
        if (!key) return '';
        return localeList.find((item) => item.event === key)?.text;
      });

      watchEffect(() => {
        selectedKeys.value = [unref(getLang)];
      });

      function toggleLocale(lang: LocaleType | string) {
        changeLocale(lang as LocaleType);
        selectedKeys.value = [lang as string];
        props.reload && location.reload();
      }

      function handleMenuEvent(menu: DropMenu) {
        toggleLocale(menu.event as string);
      }

      return { localeList, handleMenuEvent, selectedKeys, getLangText };
    },
  });
</script>

<style lang="less">
  .app-locale-picker-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }

  .app-local-picker {
    display: flex;
    align-items: center;
    cursor: pointer;

    &__icon {
      margin-right: 4px;
    }
  }
</style>
