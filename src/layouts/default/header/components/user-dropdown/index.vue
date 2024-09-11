<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name`" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem
          key="doc"
          :text="t('layout.header.dropdownItemDoc')"
          icon="ion:document-text-outline"
          v-if="getShowDoc"
        />
        <Menu.Divider v-if="getShowDoc" />
        <MenuItem
          v-if="getShowApi"
          key="api"
          :text="t('layout.header.dropdownChangeApi')"
          icon="ant-design:swap-outlined"
        />
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
  <ChangeApi @register="registerApi" />
</template>
<script lang="ts" setup>
  import { Dropdown, Menu } from 'ant-design-vue';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
  import { computed } from 'vue';
  import { DOC_URL } from '@/settings/siteSetting';
  import { useUserStore } from '@/store/modules/user';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useModal } from '@/components/Modal';
  import headerImg from '@/assets/images/header.jpg';
  import { propTypes } from '@/utils/propTypes';
  import { openWindow } from '@/utils';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'api';

  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'));
  const LockAction = createAsyncComponent(() => import('../lock/LockModal.vue'));
  const ChangeApi = createAsyncComponent(() => import('../ChangeApi/index.vue'));

  defineOptions({ name: 'UserDropdown' });

  defineProps({
    theme: propTypes.oneOf(['dark', 'light']),
  });

  const { prefixCls } = useDesign('header-user-dropdown');
  const { t } = useI18n();
  const { getShowDoc, getUseLockPage, getShowApi } = useHeaderSetting();
  const userStore = useUserStore();

  const getUserInfo = computed(() => {
    const { realName = '', avatar, desc } = userStore.getUserInfo || {};
    return { realName, avatar: avatar || headerImg, desc };
  });

  const [register, { openModal }] = useModal();
  const [registerApi, { openModal: openApiModal }] = useModal();

  function handleLock() {
    openModal(true);
  }

  function handleApi() {
    openApiModal(true, {});
  }

  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }

  // open doc
  function openDoc() {
    openWindow(DOC_URL);
  }

  function handleMenuClick(e: MenuInfo) {
    switch (e.key as MenuEvent) {
      case 'logout':
        handleLoginOut();
        break;
      case 'doc':
        openDoc();
        break;
      case 'lock':
        handleLock();
        break;
      case 'api':
        handleApi();
        break;
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    align-items: center;
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
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
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

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
