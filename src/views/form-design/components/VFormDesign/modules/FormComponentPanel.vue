<!--
 * @Author: ypt
 * @Date: 2021/11/18
 * @Description: 中间表单布局面板
 * https://github.com/SortableJS/vue.draggable.next/issues/138
-->
<template>
  <div class="form-panel v-form-container">
    <Empty
      class="empty-text"
      v-show="formConfig.schemas.length === 0"
      description="从左侧选择控件添加"
    />
    <Form v-bind="formConfig">
      <div class="draggable-box">
        <draggable
          class="list-main ant-row"
          group="form-draggable"
          :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
          ghostClass="moving"
          :animation="180"
          handle=".drag-move"
          v-model="formConfig.schemas"
          item-key="key"
          @add="addItem"
          @start="handleDragStart"
        >
          <template #item="{ element }">
            <LayoutItem
              class="drag-move"
              :schema="element"
              :data="formConfig"
              :current-item="formConfig.currentItem || {}"
            />
          </template>
        </draggable>
      </div>
    </Form>
  </div>
</template>
<script lang="ts">
  import draggable from 'vuedraggable';
  import { defineComponent, computed } from 'vue';
  import LayoutItem from '../components/LayoutItem.vue';
  import { cloneDeep } from 'lodash-es';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { Form, Empty } from 'ant-design-vue';

  export default defineComponent({
    name: 'FormComponentPanel',
    components: {
      LayoutItem,
      draggable,
      Form,
      Empty,
    },
    emits: ['handleSetSelectItem'],
    setup(_, { emit }) {
      const { formConfig } = useFormDesignState() as Recordable;

      /**
       * 拖拽完成事件
       * @param newIndex
       */
      const addItem = ({ newIndex }: any) => {
        formConfig.value.schemas = formConfig.value.schemas || [];

        const schemas = formConfig.value.schemas;
        schemas[newIndex] = cloneDeep(schemas[newIndex]);
        emit('handleSetSelectItem', schemas[newIndex]);
      };

      /**
       * 拖拽开始事件
       * @param e {Object} 事件对象
       */
      const handleDragStart = (e: any) => {
        emit('handleSetSelectItem', formConfig.value.schemas[e.oldIndex]);
      };

      // 获取祖先组件传递的currentItem

      // 计算布局元素，水平模式下为ACol，非水平模式下为div
      const layoutTag = computed(() => {
        return formConfig.value.layout === 'horizontal' ? 'Col' : 'div';
      });

      return {
        addItem,
        handleDragStart,
        formConfig,
        layoutTag,
      };
    },
  });
</script>

<style lang="less" scoped>
  @import url(../styles/variable.less);
  @import url(../styles/drag.less);

  .v-form-container {
    // 内联布局样式
    .ant-form-inline {
      .list-main {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;

        .layout-width {
          width: 100%;
        }
      }

      .ant-form-item-control-wrapper {
        min-width: 175px !important;
      }
    }
  }

  .form-panel {
    position: relative;
    height: 100%;

    .empty-text {
      color: #aaa;
      height: 150px;
      top: -10%;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      position: absolute;
      z-index: 100;
    }

    .draggable-box {
      // width: 100%;
      .drag-move {
        cursor: move;
        min-height: 62px;
      }

      .list-main {
        overflow: auto;
        height: 100%;
        // 列表动画
        .list-enter-active {
          transition: all 0.5s;
        }

        .list-leave-active {
          transition: all 0.3s;
        }

        .list-enter,
        .list-leave-to {
          opacity: 0;
          transform: translateX(-100px);
        }

        .list-enter {
          height: 30px;
        }
      }
    }
  }
</style>
