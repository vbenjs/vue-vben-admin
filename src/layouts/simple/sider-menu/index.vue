<template>
  <div>
    <div class="menus">
      <div class="mb-8 pt-5 flex flex-col items-center">
        <Avatar
          @click="handleClick(PageEnum.USER_CENTER)"
          :size="75"
          :src="getUserInfo.avatar"
          class="cursor-pointer"
          style="background-color: #06a876"
        >
          {{ getUserInfo.nickname }}
        </Avatar>
        <span @click="handleClick(PageEnum.USER_CENTER)" class="mt-2 cursor-pointer">
          {{ getUserInfo.nickname }}
        </span>
      </div>
      <Menu v-model:selectedKeys="selectedKeys" mode="inline">
        <MenuItem
          v-for="option in sideOptions"
          :key="option.path"
          @click="handleClick(option.path)"
        >
          {{ option.name }}
        </MenuItem>
      </Menu>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';
  import { Avatar, Menu, MenuItem } from 'ant-design-vue';
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import sideOptions from '../configs/side-options';
  import { PageEnum } from '/@/enums/pageEnum';

  const go = useGo();
  const userStore = useUserStore();
  const getUserInfo = computed(() => {
    const { nickname = '', avatar } = userStore.getUserInfo || {};
    return { nickname, avatar: avatar };
  });
  const route = useRoute();
  const selectedKeys = ref<string[]>([]);

  watch(
    () => route.path,
    (newPath) => {
      if (newPath) {
        selectedKeys.value = [newPath];
      }
    },
    {
      immediate: true,
    },
  );

  function handleClick(path: string) {
    go(path);
  }
</script>

<style lang="less" scoped>
  .menus {
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 10px 0 rgb(0 0 0 / 10%);
    width: 15rem;
    min-height: 30rem;
    margin-left: 2rem;
    margin-right: 2rem;
  }
</style>
