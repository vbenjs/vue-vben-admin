<template>
  <Modal
    v-model:open="isModalVisible"
    :title="t('report.Choose your metric')"
    @ok="handleApply"
    @cancel="handleCancel"
    :width="720"
  >
    <div class="modal-content">
      <div class="left-panel">
        <!-- 搜索框 -->
        <Input.Search
          v-model="searchQuery"
          :placeholder="t('report.Search Metrics')"
          style="margin-bottom: 8px"
        />

        <!-- 左侧列表：可选指标 -->
        <List :bordered="false" style="height: 300px; overflow-y: auto">
          <!-- 去除边框 -->
          <div v-for="(category, categoryName) in filteredMetrics" :key="categoryName">
            <h4>{{ getCategoryName(categoryName) }}</h4>
            <ListItem v-for="metric in category" :key="metric.key">
              <Checkbox v-model:checked="metric.selected" :disabled="metric.disabled">
                {{ t(`report.${metric.key}`) }}
              </Checkbox>
            </ListItem>
          </div>
        </List>
      </div>

      <div class="right-panel">
        <!-- 已选项标题 -->
        <div class="selected-header">
          <h4>{{ t('report.selected') }} {{ selectedMetrics.length }} {{ t('report.item') }}</h4>
          <Button @click="clearAll">{{ t('report.Clear All') }}</Button>
        </div>

        <!-- 右侧列表：已选指标 (带拖拽功能) -->
        <List :bordered="false" style="height: 300px; overflow-y: auto">
          <!-- 去除边框 -->
          <ListItem v-for="metric in selectedMetrics" :key="metric.key">
            <span>{{ t(`report.${metric.key}`) }}</span>
            <CloseOutlined @click="removeMetric(metric)" />
          </ListItem>
        </List>
      </div>
    </div>

    <template #footer>
      <Button @click="handleCancel">{{ t('report.Cancel') }}</Button>
      <Button type="primary" @click="handleApply">{{ t('report.Submit') }}</Button>
    </template>
  </Modal>
</template>

<script setup>
  import { ref, computed, defineEmits, defineProps, defineExpose, watch } from 'vue';
  import { Modal, Input, List, ListItem, Checkbox, Button } from 'ant-design-vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  // import draggable from 'vuedraggable';

  // 接收数据的 props
  const props = defineProps({
    metricsData: Object,
    selectedValue: Array,
  });
  console.log(props.selectedValue, 'selectedValue');
  // 弹窗的显示控制
  const isModalVisible = ref(false);
  const toggleModal = () => {
    isModalVisible.value = !isModalVisible.value;
  };

  // 搜索框内容
  const searchQuery = ref('');

  // 根据分类处理数据
  const processMetricsData = (data) => {
    console.log(Object.keys(data), 'data');
    return Object.keys(data).reduce((result, category) => {
      result[category] = Object.keys(data[category]).map((key) => {
        // const select = false;
        // 如果key在props.selectedValue中，设置select为true
        console.log(props.selectedValue.includes(key), '111');
        const select = props.selectedValue.includes(key);
        return {
          key,
          // selected: data[category][key] === 'selected',
          selected: select,
          disabled: data[category][key] === 'disabled',
        };
      });
      return result;
    }, {});
  };

  const metrics = ref(processMetricsData(props.metricsData));
  // 过滤后的指标列表（根据搜索内容）
  const filteredMetrics = computed(() => {
    const query = searchQuery.value.toLowerCase();
    const result = {};
    for (const category in metrics.value) {
      result[category] = metrics.value[category].filter((metric) =>
        metric.key.toLowerCase().includes(query),
      );
    }
    return result;
  });

  // 搜索
  watch(searchQuery, (newValue) => {
    if (newValue) {
      console.log(123);
      metrics.value = processMetricsData(props.metricsData);
    }
  });

  // 已选中的指标列表
  const selectedMetrics = computed(() => {
    return Object.values(metrics.value)
      .flat()
      .filter((metric) => metric.selected);
  });

  // 清除所有已选择的指标
  const clearAll = () => {
    Object.values(metrics.value).forEach((category) => {
      category.forEach((metric) => {
        metric.selected = false;
      });
    });
  };

  // 移除单个指标
  const removeMetric = (metricToRemove) => {
    for (const category in metrics.value) {
      const metric = metrics.value[category].find((m) => m.key === metricToRemove.key);
      if (metric) {
        metric.selected = false;
        break;
      }
    }
  };

  // 触发确定按钮，传递选择的指标数据
  const emit = defineEmits(['updateSelected']);
  const handleApply = () => {
    emit('updateSelected', selectedMetrics.value);
    isModalVisible.value = false;
  };

  // 取消弹窗
  const handleCancel = () => {
    isModalVisible.value = false;
  };

  // 获取分类名称
  const getCategoryName = (category) => {
    switch (category) {
      case 'recommend':
        return t('report.recommend');
      case 'advenced':
        return t('report.advenced');
      case 'session':
        return t('report.session');
      default:
        return '';
    }
  };

  defineExpose({ toggleModal, selectedMetrics });
</script>

<style scoped>
  .modal-content {
    display: flex;
    gap: 20px;
  }

  .left-panel,
  .right-panel {
    flex: 1;
  }

  .left-panel {
    padding-right: 20px;
    border-right: 1px solid #f0f0f0;
  }

  .right-panel {
    padding-left: 20px;
  }

  .selected-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
