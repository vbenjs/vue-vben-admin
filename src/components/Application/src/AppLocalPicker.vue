<template>
  <Dropdown
    :trigger="['click']"
    :dropMenuList="localeList"
    :selectedKeys="selectedKeys"
    @menuEvent="handleMenuEvent"
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

  export default defineComponent({
    name: 'AppLocalPicker',
    components: { GlobalOutlined, Dropdown },
    props: {
      showText: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
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
      }

      function handleMenuEvent(menu: DropMenu) {
        toggleLocale(menu.event as string);
      }

      return { localeList, handleMenuEvent, selectedKeys, getLangText };
    },
  });
</script>

<style lang="less" scoped>
  .app-local-picker {
    display: flex;
    align-items: center;
    cursor: pointer;

    &__icon {
      margin-right: 4px;
    }
  }
</style>
