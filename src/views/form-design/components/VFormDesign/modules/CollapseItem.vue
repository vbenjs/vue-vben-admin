<template>
  <div :class="prefixCls">
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
  import { defineComponent, reactive, PropType } from 'vue';
  import { IVFormComponent } from '../../../typings/v-form-component';
  import draggable from 'vuedraggable';
  import Icon from '@/components/Icon/Icon.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'CollapseItem',
    components: { draggable, Icon },
    props: {
      list: {
        type: [Array] as PropType<IVFormComponent[]>,
        default: () => [],
      },
      handleListPush: {
        type: Function,
        default: null,
      },
    },
    setup(props, { emit }) {
      const { prefixCls } = useDesign('form-design-collapse-item');

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
      return { prefixCls, state, handleStart, handleAdd, cloneItem };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-form-design-collapse-item';

  @import url('../styles/variable.less');

  .@{prefix-cls} {
    ul {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 0;
      padding: 5px;
      list-style: none;
      // background: #efefef;

      li {
        width: calc(50% - 6px);
        height: 36px;
        margin: 2.7px;
        padding: 8px 12px;
        transition: all 0.3s;
        border: 1px solid @border-color;
        border-radius: 3px;
        line-height: 20px;
        cursor: move;

        &:hover {
          position: relative;
          border: 1px solid @primary-color;
          // z-index: 1;
          box-shadow: 0 2px 6px @primary-color;
          color: @primary-color;
        }
      }
    }

    svg {
      display: inline !important;
    }
  }
</style>
