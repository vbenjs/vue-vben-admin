<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { injectTable } from '../hooks/useProvinceTable';
  import { useDesign } from '@/hooks/core/useDesign';
  import { getSlot } from '@/utils/helper/tsxHelper';

  import Draggable from 'vuedraggable';
  export default defineComponent({
    name: 'DragColumn',
    setup(_, { slots }) {
      const { prefixCls } = useDesign('drag-body');

      const draggingRef = ref(true);
      const tableInstance = injectTable();

      // function move(index: number, targetIndex: number) {
      // const _data = tableInstance.getDataSource().slice();
      // const key = _data[index];
      // _data.splice(index, 1);
      // if (targetIndex === 0) {
      //   _data.unshift(key);
      // } else {
      //   _data.splice(targetIndex, 0, key);
      // }
      // tableInstance.setTableData(_data);
      // }
      return () => {
        const dataSourceRef = tableInstance.getDataSource();
        return (
          <Draggable
            class={prefixCls}
            ghostClass="ghost"
            tag="tbody"
            list={unref(dataSourceRef)}
            move={({ dragged }) => {
              dragged.classList.add('drag-line');
            }}
            onStart={() => {
              draggingRef.value = true;
            }}
            onEnd={(e) => {
              const { item } = e;
              item.classList.remove('drag-line');
              // move(oldIndex, newIndex);
              draggingRef.value = false;
            }}
          >
            {getSlot(slots, 'default')}
          </Draggable>
        );
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-drag-body';

  .@{prefix-cls} {
    position: relative;
    cursor: move;
  }

  .drag-line td {
    border-top: 2px dashed @primary-color;
  }
</style>
