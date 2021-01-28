<!--
 * @Author: Vben
 * @Description: Multi-language switching component
-->
<template>
  <Dropdown
    :trigger="['click']"
    :dropMenuList="localeList"
    :selectedKeys="selectedKeys"
    @menuEvent="handleMenuEvent"
    :overlayClassName="`${prefixCls}-overlay`"
  >
    <span :class="prefixCls">
      <Icon icon="cil:language" />
      <span v-if="showText" :class="`${prefixCls}__text`">{{ getLangText }}</span>
    </span>
  </Dropdown>
</template>
<script lang="ts">
  import { defineComponent, ref, watchEffect, unref, computed } from 'vue';

  import { Dropdown, DropMenu } from '/@/components/Dropdown';

  import { useLocale } from '/@/locales/useLocale';
  import { useLocaleSetting } from '/@/hooks/setting/useLocaleSetting';

  import { LocaleType } from '/@/locales/types';

  import { propTypes } from '/@/utils/propTypes';
  import { useDesign } from '/@/hooks/web/useDesign';

  import Icon from '/@/components/Icon';
  export default defineComponent({
    name: 'AppLocalPicker',
    components: { Dropdown, Icon },
    props: {
      // Whether to display text
      showText: propTypes.bool.def(true),
      // Whether to refresh the interface when changing
      reload: propTypes.bool,
    },
    setup(props) {
      const selectedKeys = ref<string[]>([]);

      const { prefixCls } = useDesign('app-locale-picker');

      const { localeList } = useLocaleSetting();

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

      return { localeList, handleMenuEvent, selectedKeys, getLangText, prefixCls };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-locale-picker';

  :global(.@{prefix-cls}-overlay) {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    cursor: pointer;

    &__text {
      margin-left: 6px;
    }
  }
</style>
