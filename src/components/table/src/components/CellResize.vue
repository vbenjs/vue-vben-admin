<script lang="tsx">
  import { defineComponent, ref, computed, unref } from 'compatible-vue';
  import { injectTable } from '../hooks/useProvinceTable';
  import { getSlot } from '@/utils/helper/tsxHelper';

  import VueDraggableResizable from 'vue-draggable-resizable';
  export default defineComponent({
    name: 'DragResize',
    setup(props, { slots, attrs }) {
      const elRef = ref<HTMLTableRowElement | null>(null);
      const draggingMapRef = ref<{ [key in string]: number | string }>({});

      const tableInstance = injectTable();

      const getColumnsRef = computed(() => {
        const columns = tableInstance.getColumns();
        columns.forEach((col) => {
          const { key } = col;
          if (key) {
            draggingMapRef.value[key] = col.width as number;
          }
        });
        return columns;
      });

      return () => {
        const { key = '', ...restProps } = { ...attrs };
        const col = unref(getColumnsRef).find((col) => {
          const k = col.dataIndex || col.key;
          return k === key;
        });
        if (!col || !col.width) {
          return <th {...restProps}>{getSlot(slots, 'default')}</th>;
        }
        const onDrag = (x) => {
          draggingMapRef.value[key] = 0;
          col.width = Math.max(x, 1);
        };

        const onDragstop = () => {
          const el = unref(elRef);
          if (!el) {
            return;
          }
          draggingMapRef.value[key] = el.getBoundingClientRect().width;
        };

        return (
          <th {...restProps} class="resize-table-th" ref={elRef} width={col.width}>
            {getSlot(slots, 'default')}
            <VueDraggableResizable
              key={col.key}
              class="table-draggable-handle"
              w={10}
              x={draggingMapRef.value[key] || col.width}
              z={1}
              axis="x"
              draggable={true}
              resizable={false}
              onDragging={onDrag}
              onDragstop={onDragstop}
            ></VueDraggableResizable>
          </th>
        );
      };
    },
  });
</script>
<style lang="less">
  .resize-table-th {
    position: relative !important;

    .table-draggable-handle {
      position: absolute;
      right: -5px;
      bottom: 0;
      left: auto !important;
      height: 100% !important;
      cursor: col-resize;
      transform: none !important;
      touch-action: none;
    }
  }
</style>
