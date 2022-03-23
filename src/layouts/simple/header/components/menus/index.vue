<template>
  <div class="menus">
    <div class="text-center">
      <Avatar :size="80" :src="getUserInfo.avatar" style="background-color: #06a876">
        {{ getUserInfo.nickname }}
      </Avatar>
    </div>
    <ul class="menus-ul mt-8">
      <li
        v-for="option in options"
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
  import { PageEnum } from '/@/enums/pageEnum';
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';
  import { Avatar } from 'ant-design-vue';
  import { computed, defineProps } from 'vue';
  import { useRoute } from 'vue-router';

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

  const options = [
    {
      name: '首页',
      path: PageEnum.BASE_HOME,
    },
    {
      name: '个人资料',
      path: PageEnum.USER_CENTER,
    },
    {
      name: '会议列表',
      path: PageEnum.MEETING,
    },
  ];

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
