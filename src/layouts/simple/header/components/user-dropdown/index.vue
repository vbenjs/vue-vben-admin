<template>
  <div>
    <Dropdown :trigger="['click']">
      <div class="cursor-pointer">
        <Avatar size="large" :src="getUserInfo.avatar" style="background-color: #87d068">
          {{ getUserInfo.nickname }}
        </Avatar>
        <span class="ml-2">
          {{ getUserInfo.nickname }}
        </span>
      </div>
      <template #overlay>
        <Menu>
          <MenuItem
            v-for="(option, index) in options"
            :key="index"
            @click="option?.click ? option.click() : handleClick(option.path)"
          >
            <Icon v-if="option?.icon" :icon="option.icon" />
            {{ option.name }}
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
  import { Avatar, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { computed } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';
  import { PageEnum } from '/@/enums/pageEnum';
  import Icon from '/@/components/Icon';

  const userStore = useUserStore();
  const go = useGo();
  const getUserInfo = computed(() => {
    const { nickname = '', avatar } = userStore.getUserInfo || {};
    return { nickname, avatar: avatar };
  });

  const options = [
    {
      name: '个人中心',
      icon: 'ant-design:user-outlined',
      path: PageEnum.USER_CENTER,
    },
    {
      name: '安全退出',
      icon: 'ant-design:logout-outlined',
      click: () => userStore.confirmLoginOut(),
    },
  ];

  function handleClick(path: string) {
    go(path);
  }
</script>

<style></style>
