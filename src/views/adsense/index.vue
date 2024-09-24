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

        <rightContent
          v-if="!loading"
          :tableHeader="tableHeader"
          :tableData="tableData"
          :indexList="indexList"
          @update-table="updateTable"
          :selectedValue="selectedValue"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, watch, nextTick } from 'vue';
  import headerFilter from './components/headerFilter.vue';
  import leftMenu from './components/leftMenu.vue';
  import { Button, Spin } from 'ant-design-vue';
  import { googleListApi, googleGenerateApi, googleFilterApi } from '@/api/adsense/adsense';
  import rightContent from './components/rightContent.vue';
  import { AlignLeftOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  // 接口参数
  const dateRange = ref({});
  const menuParam = ref({
    dimensions: [],
    id: '',
    itemTitle: '',
    metrics: [],
    orderBy: [],
  });
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

  const selectedValue = ref([]);
  // 请求图表数据
  const tableDataList = async (dateRange, menuParam, metrics = '') => {
    const hasValidMenuParam = menuParam?.dimensions?.length > 0 && menuParam?.metrics?.length > 0;
    if (hasValidMenuParam) {
      try {
        loading.value = true;
        if (!adId.value) {
          const { accounts } = await googleListApi();
          adId.value = accounts[0].name;
        }
        let metricsList = metrics ? metrics : menuParam.metrics;
        const res = await googleGenerateApi({
          account: adId.value,
          dateRange: dateRange?.type || '',
          dimensions: menuParam?.dimensions || [],
          startDate: dateRange?.startDate || '',
          endDate: dateRange?.endDate || '',
          metrics: metricsList || '',
          orderBy: menuParam?.orderBy || '',
        });
        res.totals.cells[0].value = 'totals';
        res.rows.push(res.totals);
        tableHeader.value = res.headers;
        tableData.value = res.rows;
        selectedValue.value = res.headers.reduce((acc, cur) => {
          acc.push(cur.name);
          return acc;
        }, []);
        tableHeader.value.forEach((item) => {
          const name = 'report.' + item.name;
          item.name = t(name);
        });
        loading.value = false;
      } catch (error) {
        tableHeader.value = [];
        tableData.value = [];
        loading.value = false;
      }
    }
  };

  // 接受updateTable数据，并监听重新发送接口更新列表数据
  const updateTable = async (data) => {
    const metrics = data.reduce((acc, cur) => {
      // const key = 'report.' + cur.key;
      acc.push(cur.key);
      return acc;
    }, []);
    await tableDataList(dateRange.value, menuParam.value, metrics);
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
      await tableDataList(newDateRange, newMenuParam);
    },
    { deep: true, immediate: true },
  );

  const indexList = ref({});
  watch(
    () => menuParam.value?.id,
    async (newAdId) => {
      try {
        if (newAdId) {
          const res = await googleFilterApi({
            id: newAdId,
          });
          indexList.value = res;
          await nextTick();
        }
      } catch (error) {
        console.error('googleFilterApi======err0r', error);
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
    margin-top: 20px;
  }
</style>
