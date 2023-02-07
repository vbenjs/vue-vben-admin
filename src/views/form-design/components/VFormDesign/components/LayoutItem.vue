<!--
 * @Author: ypt
 * @Date: 2021/11/19
 * @Description: 表单项布局控件
 * 千万不要在template下面的第一行加注释，因为这里拖动的第一个元素
-->

<template>
  <Col v-bind="colPropsComputed">
    <template v-if="['Grid'].includes(schema.component)">
      <div
        class="grid-box"
        :class="{ active: schema.key === currentItem.key }"
        @click.stop="handleSetSelectItem(schema)"
      >
        <Row class="grid-row" v-bind="schema.componentProps">
          <Col
            class="grid-col"
            v-for="(colItem, index) in schema.columns"
            :key="index"
            :span="colItem.span"
          >
            <!-- <div class="draggable-box"> -->
            <!-- <div class="list-main"> -->
            <draggable
              class="list-main draggable-box"
              :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
              v-bind="{
                group: 'form-draggable',
                ghostClass: 'moving',
                animation: 180,
                handle: '.drag-move',
              }"
              item-key="key"
              v-model="colItem.children"
              @start="$emit('dragStart', $event, colItem.children)"
              @add="$emit('handleColAdd', $event, colItem.children)"
            >
              <!-- <transition-group tag="div" name="list" class="list-main"> -->
              <template #item="{ element }">
                <LayoutItem
                  class="drag-move"
                  :schema="element"
                  :current-item="currentItem"
                  @handle-copy="$emit('handle-copy')"
                  @handle-delete="$emit('handle-delete')"
                />
              </template>
              <!-- </transition-group> -->
            </draggable>
            <!-- </div> -->
            <!-- </div> -->
          </Col>
        </Row>
        <FormNodeOperate :schema="schema" :currentItem="currentItem" />
      </div>
    </template>
    <FormNode
      v-else
      :key="schema.key"
      :schema="schema"
      :current-item="currentItem"
      @handle-copy="$emit('handle-copy')"
      @handle-delete="$emit('handle-delete')"
    />
  </Col>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';
  import draggable from 'vuedraggable';
  import FormNode from './FormNode.vue';
  import FormNodeOperate from './FormNodeOperate.vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { IVFormComponent } from '../../../typings/v-form-component';
  import { Row, Col } from 'ant-design-vue';
  export default defineComponent({
    name: 'LayoutItem',
    components: {
      FormNode,
      FormNodeOperate,
      draggable,
      Row,
      Col,
    },
    props: {
      schema: {
        type: Object as PropType<IVFormComponent>,
        required: true,
      },
      currentItem: {
        type: Object,
        required: true,
      },
    },
    emits: ['dragStart', 'handleColAdd', 'handle-copy', 'handle-delete'],
    setup(props) {
      const {
        formDesignMethods: { handleSetSelectItem },
        formConfig,
      } = useFormDesignState();
      const state = reactive({});
      const colPropsComputed = computed(() => {
        const { colProps = {} } = props.schema;
        return colProps;
      });

      const list1 = computed(() => props.schema.columns);

      // 计算布局元素，水平模式下为ACol，非水平模式下为div
      const layoutTag = computed(() => {
        return formConfig.value.layout === 'horizontal' ? 'Col' : 'div';
      });

      return {
        ...toRefs(state),
        colPropsComputed,
        handleSetSelectItem,
        layoutTag,
        list1,
      };
    },
  });
</script>
<style lang="less">
  @import url(../styles/variable.less);

  .layout-width {
    width: 100%;
  }

  .hidden-item {
    background-color: rgb(240, 191, 195);
    //opacity: 0.5;
  }
</style>
