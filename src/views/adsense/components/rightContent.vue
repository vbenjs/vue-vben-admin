<template>
  <div class="right-content">
    <div class="header-filter">
      <Button v-for="(option, index) in buttonList" :key="index">
        {{ t(`report.${option.key}`) }}
      </Button>
      <Button @click="togglePopUp"><EditOutlined /></Button>
    </div>
    <popUp
      ref="childRef"
      :metricsData="modalData"
      :selectedValue="selectedValue"
      @update-selected="handleSelected"
    />
    <!-- Bar Chart with white background and border -->
    <div id="chart" class="chart"></div>

    <!-- Table with white background and border -->
    <Table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      class="custom-table"
      :scroll="{ x: 1500, y: 300 }"
    />
  </div>
</template>

<script setup>
  import {
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
    onUnmounted,
    defineProps,
    defineEmits,
  } from 'vue';
  import { Table, Button } from 'ant-design-vue';
  import * as echarts from 'echarts';
  import { useI18n } from '@/hooks/web/useI18n';
  import popUp from './popUp.vue';
  import { EditOutlined } from '@ant-design/icons-vue';

  const { t } = useI18n();
  // Props for table header and data
  const props = defineProps({
    tableHeader: Array,
    tableData: Array,
    indexList: Object,
    selectedValue: Array,
  });

  // 控制筛选弹窗
  const childRef = ref(null);
  const buttonList = ref([]);
  onMounted(() => {
    buttonList.value = childRef.value.selectedMetrics;
  });
  const togglePopUp = () => {
    if (childRef.value) {
      childRef.value.toggleModal(); // 调用子组件的方法
    }
  };

  // Dynamic Table Columns and Data
  const columns = ref([]);
  const dataSource = ref([]);

  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: props.tableData.length,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '30', '50'],
  });

  // 处理表格分页和排序变化
  const handleTableChange = (paginationObj, filters, sorter) => {
    const { current, pageSize } = paginationObj;
    pagination.value = { ...pagination.value, current, pageSize };

    const { field, order } = sorter;

    // 处理排序逻辑，确保按照数字大小排序
    let sortedData = [...props.tableData];
    if (field && order) {
      sortedData = sortedData.sort((a, b) => {
        const fieldIndex = props.tableHeader.findIndex((header) => header.name === field);
        const valueA = Number(a.cells[fieldIndex].value) || 0;
        const valueB = Number(b.cells[fieldIndex].value) || 0;
        if (order === 'ascend') {
          return valueA - valueB;
        } else if (order === 'descend') {
          return valueB - valueA;
        }
        return 0;
      });
    }

    // 根据分页更新数据
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    dataSource.value = sortedData.slice(start, end).map((row, index) => {
      const dataObject = { key: start + index };
      row.cells.forEach((cell, i) => {
        dataObject[props.tableHeader[i].name] = cell.value;
      });
      return dataObject;
    });
  };
  // 选中列表

  const emit = defineEmits(['updateTable']);
  const selectList = ref([]);
  const handleSelected = (selected) => {
    selectList.value = selected.reduce((acc, cur) => {
      const key = 'report.' + cur.key;
      const accKey = t(key);
      acc.push(accKey);
      return acc;
    }, []);
    emit('updateTable', selected);
  };

  const modalData = ref(props.indexList);
  watch(
    () => props.indexList, // 父组件监听从爷爷组件传来的数据
    (newData) => {
      if (newData) {
        modalData.value = newData; // 更新弹窗组件的数据
      }
    },
    { immediate: true },
  );
  // Generate columns based on props.tableHeader
  const generateColumns = () => {
    columns.value = props.tableHeader.map((header) => {
      // const title = 'report.' + header.name;
      return {
        title: header.name,
        // title: t(title),
        dataIndex: header.name,
        sorter: true,
      };
    });
  };

  // Generate table data based on props.tableData
  const generateData = () => {
    const { current, pageSize } = pagination.value;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    dataSource.value = props.tableData.slice(start, end).map((row, index) => {
      const dataObject = { key: start + index };
      row.cells.forEach((cell, i) => {
        dataObject[props.tableHeader[i].name] = cell.value;
      });
      return dataObject;
    });
  };

  // Watch for changes in props and update columns and data
  watch(
    [() => props.tableHeader, () => props.tableData],
    () => {
      generateColumns();
      generateData();
    },
    { immediate: true },
  );

  // ECharts setup
  let chartInstance = null;

  const resizeChart = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };
  const metricHeaders = ref([]);
  metricHeaders.value = props.tableHeader;
  const updateChart = () => {
    const chartDom = document.getElementById('chart');
    if (chartInstance) {
      chartInstance.dispose();
    }
    chartInstance = echarts.init(chartDom);

    const filters = props.tableData.filter((row) => {
      return row.cells[0].value !== 'totals';
    });
    // 获取维度和指标
    // const dimensionHeader = props.tableHeader.find((header) => header.type === 'DIMENSION');
    const xAxisData = filters.map((row) => {
      return row.cells[props.tableHeader.findIndex((header) => header.type === 'DIMENSION')].value;
    });
    const seriesData = metricHeaders.value.map((metric) => {
      const data = filters.map((row) => {
        const index = props.tableHeader.findIndex((header) => header.name === metric.name);
        return Number(row.cells[index].value) || 0;
      });
      // const name = 'report.' + metric.name;
      // metric.name = t(name);
      return {
        name: metric.name,
        type: 'bar',
        data,
      };
    });
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: metricHeaders.value?.map((metric) => metric.name),
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          interval: 0,
          rotate: 45,
          formatter: (value) => (value.length > 10 ? `${value.slice(0, 10)}...` : value),
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: seriesData,
      graphic: {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: seriesData.length > 0 ? '' : t('report.No Data Available'), // 自定义的无数据提示信息
          fontSize: 20,
          fontWeight: 'bold',
          fill: '#999', // 文字颜色
        },
      },
    };

    chartInstance.setOption(option);
  };

  onMounted(() => {
    updateChart();
    window.addEventListener('resize', resizeChart);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
  });

  onUnmounted(() => {
    if (chartInstance) {
      chartInstance.dispose();
    }
  });

  watch(() => props.tableData, updateChart);
</script>

<style scoped>
  .right-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    gap: 20px;
  }

  .chart {
    box-sizing: border-box;
    flex-grow: 1;
    width: 100%;
    min-height: 500px;
    padding: 16px;
    border: 1px solid #dadce0;
    background-color: #fff;
  }

  .custom-table {
    width: 100%;
    border: 1px solid #dadce0;
    border-radius: 4px;
    background-color: #fff;
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #dadce0;
  }

  .header-filter {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
</style>
