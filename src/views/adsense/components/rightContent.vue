<template>
  <div class="right-content">
    <!-- Button List with Ant Design Check Icon and Flexbox -->
    <!-- <div class="button-container">
      <Button
        v-for="(item, index) in buttons"
        :key="index"
        @click="selectButton(index)"
        class="custom-button"
      >
        <CheckOutlined v-if="selectedButton === index" style="margin-right: 4px; color: green" />
        {{ item.label }}
      </Button>
    </div> -->

    <!-- Bar Chart with white background and border -->
    <div id="chart" class="chart"></div>

    <!-- Table with white background and border -->
    <Table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      class="custom-table"
    />
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, onBeforeUnmount, onUnmounted, defineProps } from 'vue';
  import { Table } from 'ant-design-vue';
  // import { CheckOutlined } from '@ant-design/icons-vue';
  import * as echarts from 'echarts';

  // Props for table header and data
  const props = defineProps({
    tableHeader: Array,
    tableData: Array,
  });

  // Button List
  // const buttons = ref([
  //   { label: 'Estimated earnings' },
  //   { label: 'Impressions' },
  //   { label: 'Impression RPM' },
  //   { label: 'Active View Viewable' },
  //   { label: 'Clicks' },
  // ]);
  // const selectedButton = ref(null);

  // const selectButton = (index) => {
  //   selectedButton.value = index;
  // };

  // Dynamic Table Columns and Data
  const columns = ref([]);
  const dataSource = ref([]);

  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: props.tableData.length,
  });

  const handleTableChange = (pagination, filters, sorter) => {
    console.log('Pagination: ', pagination);
    console.log('Sorter: ', sorter);
  };

  // Generate columns based on props.tableHeader
  const generateColumns = () => {
    columns.value = props.tableHeader.map((header) => ({
      title: header.name,
      dataIndex: header.name,
      sorter: header.type === 'METRIC_TALLY',
    }));
  };

  // Generate table data based on props.tableData
  const generateData = () => {
    dataSource.value = props.tableData.map((row, index) => {
      const dataObject = { key: index };
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
  const updateChart = () => {
    const chartDom = document.getElementById('chart');
    if (chartInstance) {
      chartInstance.dispose();
    }
    chartInstance = echarts.init(chartDom);

    // 识别维度和指标
    // const dimensionHeaders = props.tableHeader.filter((header) => header.type === 'DIMENSION');
    const metricHeaders = props.tableHeader.filter((header) => header.type === 'METRIC_TALLY');

    // 获取维度数据
    const xAxisData = props.tableData.map((row) => {
      return row.cells[props.tableHeader.findIndex((header) => header.type === 'DIMENSION')].value;
    });

    // 准备各个指标的 series 数据
    const seriesData = metricHeaders.map((metric) => {
      const data = props.tableData.map((row) => {
        // 获取当前指标的值
        const index = props.tableHeader.findIndex((header) => header.name === metric.name);
        return Number(row.cells[index].value) || 0;
      });

      return {
        name: metric.name,
        type: 'bar',
        data,
      };
    });

    const option = {
      // title: {
      //   text: '动态数据统计',
      // },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: metricHeaders.map((metric) => metric.name),
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          interval: 0, // 强制显示所有标签
          rotate: 45, // 可选，旋转标签
          formatter: function (value) {
            return value.length > 10 ? value.slice(0, 10) + '...' : value; // 长标签截断
          },
        },
        axisTick: {
          alignWithLabel: true, // 确保刻度线对齐标签
        },
      },
      // xAxis: {
      //   type: 'category',
      //   data: xAxisData, // X轴使用维度数据
      // },
      yAxis: {
        type: 'value',
      },
      series: seriesData,
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

  .button-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    gap: 10px;
  }

  .custom-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 20px;
    border: 1px solid #d9d9d9;
    background-color: white;
    color: #000;
    font-size: 14px;
  }

  .custom-button:hover {
    border-color: #40a9ff;
  }

  .chart {
    box-sizing: border-box;
    flex-grow: 1;
    width: 100%;
    height: 400px;
    padding: 16px;
    border: 1px solid #dadce0;
    background-color: #fff;
  }

  .custom-table {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #dadce0;
    border-radius: 4px;
    background-color: #fff;
  }

  .ant-table-wrapper {
    border: none;
    background-color: #fff;
  }

  .ant-table {
    border-top: 1px solid #dadce0;
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #dadce0;
  }
</style>
