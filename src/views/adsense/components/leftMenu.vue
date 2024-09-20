<template>
  <div :class="{ 'left-side-menu': true, collapsed: isCollapsed }">
    <draggable
      v-model="list"
      group="items"
      :animation="300"
      @start="drag = true"
      @end="drag = false"
      :item-key="'id'"
    >
      <template #item="{ element }">
        <div
          class="menu-item"
          :class="{ selected: selectedItem === element.id }"
          @click="selectItem(element)"
          @mouseenter="hoverItem(element.id)"
          @mouseleave="hoverItem(null)"
        >
          <div class="menu-item-content">
            <DragOutlined v-if="hoveredItem === element.id" class="hover-drag-icon" />
            <div class="menu-item-icon">
              <SvgIcon name="ad-menu" class="mr-1" />
              <div class="text-ellipsis" :title="element.name">{{ element.name }}</div>
            </div>
            <div class="menu-item-des text-ellipsis" :title="element.des"> {{ element.des }} </div>
          </div>

          <div class="drag-icon" @click.stop="toggleMoveTop(element.id)">
            <MoreOutlined />
          </div>
          <div
            v-if="showMoveTop === element.id"
            class="move-top"
            @click.stop="moveItemToTop(element.id)"
          >
            Move Top
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, defineEmits, defineProps } from 'vue';
  import draggable from 'vuedraggable';
  import { SvgIcon } from '@/components/Icon';
  import { DragOutlined, MoreOutlined } from '@ant-design/icons-vue';
  import { listConfig } from './config/listConfig.js';

  defineProps({
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  });
  const list = ref(listConfig);
  const emit = defineEmits(['menuSendData']);
  const drag = ref(false);
  const selectedItem = ref(null);
  const showMoveTop = ref(null);
  const hoveredItem = ref(null);
  const menuParams = ref({
    dimensions: [],
    metrics: [],
    orderBy: '',
    itemTitle: 'Top',
    id: '',
  });
  const itemTitle = ref('');
  const selectItem = (item) => {
    selectedItem.value = item.id;
    showMoveTop.value = null;
    menuParams.value.dimensions = item.value;
    menuParams.value.itemTitle = item.name;
    menuParams.value.metrics = item.metrics;
    menuParams.value.orderBy = item.orderBy;
    itemTitle.value = item.name;
    menuParams.value.id = item.id;
    emit('menuSendData', menuParams);
  };
  const toggleMoveTop = (id) => {
    showMoveTop.value = showMoveTop.value === id ? null : id;
  };

  const moveItemToTop = (id) => {
    const itemIndex = list.value.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      const [item] = list.value.splice(itemIndex, 1);
      list.value.unshift(item); // 将该项移到顶部
    }
    showMoveTop.value = null; // 点击后隐藏 Move Top
  };

  const hoverItem = (id) => {
    hoveredItem.value = id;
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.menu-item') && !event.target.closest('.move-top')) {
      showMoveTop.value = null; // 点击在外部区域时隐藏 Move Top
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style scoped>
  @keyframes pulse-animation {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.05);
    }

    100% {
      transform: scale(1);
    }
  }

  .left-side-menu {
    position: relative;
    top: 0;
    left: 0;
    width: 250px;
    height: 100%;
    overflow: auto;
    transition: left 0.3s;
    background-color: #f0f0f0;
  }

  .left-side-menu.collapsed {
    left: -250px;
  }

  .left-side-menu div {
    cursor: pointer;
  }

  .menu-item {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.3s;
    border-bottom: 1px solid #dadce0;
  }

  /* Hover 背景色 */
  .menu-item:hover {
    background-color: #f1f3f4;
  }

  .menu-item-content {
    position: relative;
    align-items: center;
    padding: 18px 16px 18px 24px;
  }

  .menu-item-icon {
    display: flex;
    align-items: center;
  }

  /* 选中项的样式 */
  .menu-item.selected {
    border-left: 6px solid #1a73e8;
    background-color: #e8f0fe;
  }

  .drag-icon {
    padding: 12px;
  }

  .hover-drag-icon {
    position: absolute;
    top: 28px;
    left: 8px;
    color: #1a73e8;
  }

  .move-top {
    position: absolute;
    top: 50%;
    right: 0;
    width: 80px;
    height: 54px;
    padding: 4px 8px;
    transform: translateY(-50%);
    border-radius: 4px;
    background-color: #fff;
    box-shadow:
      0 1px 2px 0 rgb(60 64 67 / 30%),
      0 2px 6px 2px rgb(60 64 67 / 15%);
    color: #000;
    font-size: 14px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }

  /* 动画 */
  .pulse {
    animation: pulse-animation 1s infinite;
  }

  .menu-item-des {
    max-width: 160px;
  }

  .menu-item-icon div {
    max-width: 135px;
  }

  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
