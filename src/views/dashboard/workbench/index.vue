<template>
  <PageWrapper>
    <h1>测试数据 {{ getUserInfo }}</h1>
    <Button @click="handleSetTitleAndId">改变title-id</Button>
    <Button @click="handleSetDemoAllInfo">改变info</Button>

    <ul>
      <li v-for="item in getUserDemoInfo" :key="item.time.toString()">
        file:{{ item.file }}; name:{{ item.name }}; url:{{ item.url }}; time:{{ item.time }}
      </li>
    </ul>
    <template #headerContent> <WorkbenchHeader /> </template>
    <div class="lg:flex">
      <div class="lg:w-7/10 w-full !mr-4 enter-y">
        <ProjectCard :loading="loading" class="enter-y" />
        <DynamicInfo :loading="loading" class="!my-4 enter-y" />
      </div>
      <div class="lg:w-3/10 w-full enter-y">
        <QuickNav :loading="loading" class="enter-y" />

        <Card class="!my-4 enter-y" :loading="loading">
          <img class="xl:h-50 h-30 mx-auto" src="../../../assets/svg/illustration.svg" />
        </Card>

        <SaleRadar :loading="loading" class="enter-y" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import ProjectCard from './components/ProjectCard.vue';
  import QuickNav from './components/QuickNav.vue';
  import DynamicInfo from './components/DynamicInfo.vue';
  import SaleRadar from './components/SaleRadar.vue';
  import { useDemoStore } from '/@/store/modules/demo';
  import { Card, Button } from 'ant-design-vue';

  export default defineComponent({
    name: 'WorkbenchIndex',
    components: {
      SaleRadar,
      DynamicInfo,
      QuickNav,
      ProjectCard,
      WorkbenchHeader,
      PageWrapper,
      Card,
      Button,
    },

    setup() {
      const loading = ref(true);
      const id = ref(1);

      setTimeout(() => {
        loading.value = false;
      }, 1500);

      const demoStore = useDemoStore();

      const getUserInfo = computed(
        () => '名称:' + demoStore.getTitle + ';id:' + demoStore.getDemoId,
      );
      const getUserDemoInfo = computed(() => demoStore.getInfo);

      function handleSetTitleAndId() {
        demoStore.setDemoIdAndTitle(id.value++, '哈哈哈');
      }

      function handleSetDemoAllInfo() {
        const idValue = id.value++;
        demoStore.addDemoInfo({
          file: 'file名字' + idValue,
          name: 'name' + idValue,
          url: 'url' + idValue,
        });
      }

      return {
        getUserInfo,
        getUserDemoInfo,
        handleSetTitleAndId,
        handleSetDemoAllInfo,
        loading,
      };
    },
  });
</script>
