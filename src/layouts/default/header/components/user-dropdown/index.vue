<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]">
      <img :class="`${prefixCls}__header`" :src="headerImg" />
      <span :class="`${prefixCls}__info`">
        <span :class="`${prefixCls}__name anticon`">{{ getUserInfo.realName }}</span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem
          key="doc"
          :text="t('layout.header.dropdownItemDoc')"
          icon="gg:loadbar-doc"
          v-if="getShowDoc"
        />
        <MenuDivider />
        <MenuItem
          key="loginOut"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="carbon:power"
        />
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts">
  // components
  import { Dropdown, Menu } from 'ant-design-vue';

  import { defineComponent, computed } from 'vue';

  // res

  import { userStore } from '/@/store/modules/user';

  import { DOC_URL } from '/@/settings/siteSetting';

  import { openWindow } from '/@/utils';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { propTypes } from '/@/utils/propTypes';
  import headerImg from '/@/assets/images/header.jpg';

  type MenuEvent = 'loginOut' | 'doc';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getShowDoc } = useHeaderSetting();

      const getUserInfo = computed(() => {
        const { realName = '', desc } = userStore.getUserInfoState || {};
        return { realName, desc };
      });

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      // open doc
      function openDoc() {
        openWindow(DOC_URL);
      }

      function handleMenuClick(e: { key: MenuEvent }) {
        switch (e.key) {
          case 'loginOut':
            handleLoginOut();
            break;
          case 'doc':
            openDoc();
            break;
        }
      }

      return {
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        headerImg,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    display: flex;
    height: @header-height;
    min-width: 100px;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    &:hover {
      background: @header-light-bg-hover-color;
    }

    img {
      width: 26px;
      height: 26px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background: @header-dark-bg-hover-color;
      }
    }

    &--light {
      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
