<template>
  <div class="menus">
    <div class="text-center">
      <Avatar :size="80" :src="getUserInfo.avatar" style="background-color: #06a876">
        {{ getUserInfo.nickname }}
      </Avatar>
    </div>
    <ul class="menus-ul mt-8">
      <li
        v-for="option in sideOptions"
        :key="option.name"
        @click="handleClick(option.path)"
        :class="option.path === currentPath ? 'active' : undefined"
      >
        {{ option.name }}
      </li>
      <li @click="logout"> 安全退出 </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';
  import { Avatar } from 'ant-design-vue';
  import { computed, defineProps } from 'vue';
  import { useRoute } from 'vue-router';
  import sideOptions from '../../../configs/side-options';

  const props = defineProps<{
    onClose: () => void;
  }>();

  const go = useGo();
  const userStore = useUserStore();
  const getUserInfo = computed(() => {
    const { nickname = '', avatar } = userStore.getUserInfo || {};
    return { nickname, avatar: avatar };
  });
  const route = useRoute();

  const currentPath = computed(() => route.path);

  function handleClick(path: string) {
    go(path);
    props?.onClose();
  }

  function logout() {
    userStore.confirmLoginOut();
  }
</script>

<style lang="less" scoped>
  .menus {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .menus-ul {
    display: flex;
    flex-direction: column;

    li {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .active {
      color: @primary-color;
    }
  }
</style>
