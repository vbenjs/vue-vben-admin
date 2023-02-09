<template>
  <div>
    <draggable
      tag="ul"
      :model-value="list"
      v-bind="{
        group: { name: 'form-draggable', pull: 'clone', put: false },
        sort: false,
        clone: cloneItem,
        animation: 180,
        ghostClass: 'moving',
      }"
      item-key="type"
      @start="handleStart($event, list)"
      @add="handleAdd"
    >
      <template #item="{ element, index }">
        <li
          class="bs-box text-ellipsis"
          @dragstart="$emit('add-attrs', list, index)"
          @click="$emit('handle-list-push', element)"
        >
          <!-- <svg v-if="element.icon.indexOf('icon-') > -1" class="icon" aria-hidden="true">
            <use :xlink:href="`#${element.icon}`" />
          </svg> -->
          <Icon :icon="element.icon" />
          {{ element.label }}</li
        ></template
      >
    </draggable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { IVFormComponent } from '../../../typings/v-form-component';
  import draggable from 'vuedraggable';
  // import { toRefs } from '@vueuse/core';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    name: 'CollapseItem',
    components: { draggable, Icon },
    props: {
      list: {
        type: [Array] as PropType<IVFormComponent[]>,
        default: () => [],
      },
      handleListPush: {
        type: Function as PropType<(item: IVFormComponent) => void>,
        default: null,
      },
    },
    setup(props, { emit }) {
      const state = reactive({});
      const handleStart = (e: any, list1: IVFormComponent[]) => {
        emit('start', list1[e.oldIndex].component);
      };
      const handleAdd = (e: any) => {
        console.log(e);
      };
      // https://github.com/SortableJS/vue.draggable.next
      // https://github.com/SortableJS/vue.draggable.next/blob/master/example/components/custom-clone.vue
      const cloneItem = (one) => {
        return props.handleListPush(one);
      };
      return { state, handleStart, handleAdd, cloneItem };
    },
  });
</script>

<style lang="less" scoped>
  @import url(../styles/variable.less);

  ul {
    padding: 5px;
    list-style: none;
    display: flex;
    margin-bottom: 0;
    flex-wrap: wrap;
    // background: #efefef;

    li {
      padding: 8px 12px;
      transition: all 0.3s;
      width: calc(50% - 6px);
      margin: 2.7px;
      height: 36px;
      line-height: 20px;
      cursor: move;
      border: 1px solid @border-color;
      border-radius: 3px;

      &:hover {
        color: @primary-color;
        border: 1px solid @primary-color;
        position: relative;
        // z-index: 1;
        box-shadow: 0 2px 6px @primary-color;
      }
    }
  }

  svg {
    display: inline !important;
  }
</style>
