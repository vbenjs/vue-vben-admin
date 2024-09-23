<template>
  <Modal
    v-model:open="isModalVisible"
    title="选择您的指标"
    @ok="handleApply"
    @cancel="handleCancel"
    :width="720"
  >
    <div class="modal-content">
      <div class="left-panel">
        <!-- 搜索框 -->
        <Input.Search v-model="searchQuery" placeholder="搜索指标..." style="margin-bottom: 8px" />

        <!-- 左侧列表：可选指标 -->
        <List :bordered="false" style="height: 300px; overflow-y: auto">
          <!-- 去除边框 -->
          <div v-for="(category, categoryName) in filteredMetrics" :key="categoryName">
            <h4>{{ getCategoryName(categoryName) }}</h4>
            <ListItem v-for="metric in category" :key="metric.key">
              <Checkbox v-model:checked="metric.selected" :disabled="metric.disabled">
                {{ metric.key }}
              </Checkbox>
            </ListItem>
          </div>
        </List>
      </div>

      <div class="right-panel">
        <!-- 已选项标题 -->
        <div class="selected-header">
          <h4>已选择 {{ selectedMetrics.length }} 项</h4>
          <Button @click="clearAll">全部清除</Button>
        </div>

        <!-- 右侧列表：已选指标 (带拖拽功能) -->
        <List :bordered="false" style="height: 300px; overflow-y: auto">
          <!-- 去除边框 -->
          <ListItem v-for="metric in selectedMetrics" :key="metric.key">
            <span>{{ metric.key }}</span>
            <CloseOutlined @click="removeMetric(metric)" />
          </ListItem>
        </List>
      </div>
    </div>

    <template #footer>
      <Button @click="handleCancel">取消</Button>
      <Button type="primary" @click="handleApply">应用</Button>
    </template>
  </Modal>
</template>

<script setup>
  import { ref, computed, defineEmits, defineProps, defineExpose } from 'vue';
  import { Modal, Input, List, ListItem, Checkbox, Button } from 'ant-design-vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  // import draggable from 'vuedraggable';

  // 接收数据的 props
  const props = defineProps({
    metricsData: Object,
  });
  console.log(props.metricsData, 'props');
  // 弹窗的显示控制
  const isModalVisible = ref(false);
  const toggleModal = () => {
    isModalVisible.value = !isModalVisible.value;
  };
  defineExpose({ toggleModal });
  // 搜索框内容
  const searchQuery = ref('');

  // 根据分类处理数据
  const processMetricsData = (data) => {
    return Object.keys(data).reduce((result, category) => {
      result[category] = Object.keys(data[category]).map((key) => {
        return {
          key,
          selected: data[category][key] === 'selected',
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
    console.log(query, 'query');
    const result = {};
    for (const category in metrics.value) {
      result[category] = metrics.value[category].filter((metric) =>
        metric.key.toLowerCase().includes(query),
      );
    }
    return result;
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
        return '推荐';
      case 'advenced':
        return '高级';
      case 'session':
        return '会话';
      default:
        return '';
    }
  };
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
