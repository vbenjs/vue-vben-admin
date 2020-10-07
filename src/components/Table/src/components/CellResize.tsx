import { defineComponent, ref, computed, unref } from 'vue';
import { injectTable } from '../hooks/useProvinceTable';
import { getSlot } from '/@/utils/helper/tsxHelper';

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
      const onDrag = (x: number) => {
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
        <th
          {...restProps}
          class="resize-table-th"
          ref={elRef}
          style={{
            width: `${col.width}px`,
          }}
        >
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
          />
        </th>
      );
    };
  },
});
