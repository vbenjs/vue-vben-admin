<template>
  <div>
    <headerFilter @send-data="sendData" />
    <div class="layout">
      <div :class="{ sidebar: true, isCollapsed: collapsed }">
        <div class="menu-container">
          <leftMenu :isCollapsed="collapsed" @menu-send-data="menuSendData" />
        </div>
      </div>
      <div class="content">
        <div class="loading-container" v-if="loading">
          <Spin size="large" />
        </div>
        <div v-if="!loading" class="top-toggle">
          <div class="title-container"
            ><Button @click="toggleMenu"> <AlignLeftOutlined /> </Button><em>{{ title }}</em>
          </div>
        </div>

        <rightContent v-if="!loading" :tableHeader="tableHeader" :tableData="tableData" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, watch } from 'vue';
  import headerFilter from './components/headerFilter.vue';
  import leftMenu from './components/leftMenu.vue';
  import { Button, Spin } from 'ant-design-vue';
  import { googleListApi, googleGenerateApi } from '@/api/adsense/adsense';
  import rightContent from './components/rightContent.vue';
  import { AlignLeftOutlined } from '@ant-design/icons-vue';
  // 接口参数
  const dateRange = ref({});
  const menuParam = ref('');
  // 菜单切换
  const collapsed = ref(false);

  const loading = ref(false);

  // 表单数据
  const tableHeader = ref([]);
  const tableData = ref([]);

  const toggleMenu = () => {
    collapsed.value = !collapsed.value;
  };

  // 日期参数
  const sendData = (data) => {
    dateRange.value = data;
  };
  // 左侧头部title
  const title = ref('Top');
  // 菜单参数
  const menuSendData = (data) => {
    menuParam.value = data.value;
    title.value = data.value.itemTitle;
  };

  // 前置接口获取id
  const adId = ref('');
  onBeforeMount(async () => {
    try {
      // 获取广告列表
      const { accounts } = await googleListApi();
      adId.value = accounts[0].name;
    } catch (error) {
      console.log(error, 'error');
    }
  });

  watch(
    [dateRange, menuParam],
    async ([newDateRange, newMenuParam]) => {
      const hasValidMenuParam =
        newMenuParam?.dimensions?.length > 0 && newMenuParam?.metrics?.length > 0;
      if (hasValidMenuParam) {
        try {
          loading.value = true;
          const res = await googleGenerateApi({
            account: adId.value,
            dateRange: newDateRange?.type || '',
            dimensions: newMenuParam?.dimensions || [],
            startDate: newDateRange?.startDate || '',
            endDate: newDateRange?.endDate || '',
            metrics: newMenuParam?.metrics || '',
            orderBy: newMenuParam?.orderBy || '',
          });
          tableHeader.value = res.headers;
          tableData.value = res.rows;
          loading.value = false;
        } catch (error) {
          tableHeader.value = [];
          tableData.value = [];
          loading.value = false;
          console.error('googleGenerateApi======err0r', error);
        }
      }
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="scss" scoped>
  .left-side-menu {
    height: 100%;
    background-color: #fff;
  }

  .layout {
    display: flex;
    width: calc(100vw - 250px);
    height: calc(100vh - 145px);
  }

  .sidebar {
    height: calc(100vh - 145px);
    overflow-y: auto;
    transition: width 0.3s ease;
    background-color: #fff;
  }

  .isCollapsed {
    width: 0;
  }

  .content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    transition: margin-left 0.3s ease;
    background-color: #f8f9fa;
  }

  .menu-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .top-toggle {
    padding: 16px 0 16px 8px;
    border-bottom: 1px solid #dadce0;
  }

  .scrollable-content {
    padding: 16px;
  }

  .scrollable-content::-webkit-scrollbar {
    width: 8px;
  }

  .scrollable-content::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #888;
  }

  .scrollable-content::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  .scrollable-content::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: #f1f1f1;
  }

  .sidebar.isCollapsed {
    width: 0;
  }

  button {
    border: none;
    background-color: initial;
  }

  .title-container {
    font-size: 18px;
  }

  .loading-container {
    display: flex;
    justify-content: center;
  }
</style>
