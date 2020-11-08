import { BasicColumn, BasicTableProps } from '../types/table';
import { PaginationProps } from '../types/pagination';
import { unref, ComputedRef, Ref, computed, watchEffect, ref, toRaw } from 'vue';
import { isBoolean, isArray, isObject } from '/@/utils/is';
import { PAGE_SIZE } from '../const';
import { useProps } from './useProps';

export function useColumns(
  refProps: ComputedRef<BasicTableProps>,
  getPaginationRef: ComputedRef<false | PaginationProps>
) {
  const { propsRef } = useProps(refProps);
  const columnsRef = (ref(unref(propsRef).columns) as unknown) as Ref<BasicColumn[]>;
  const cacheColumnsRef = (ref(unref(propsRef).columns) as unknown) as Ref<BasicColumn[]>;

  const getColumnsRef = computed(() => {
    const props = unref(propsRef);
    const { showIndexColumn, indexColumnProps, ellipsis, actionColumn, isTreeTable } = props;

    const columns = unref(columnsRef);
    if (!columns) {
      return [];
    }
    let pushIndexColumns = false;
    columns.forEach((item) => {
      const { children } = item;
      handleItem(item, !!ellipsis);

      handleChildren(children, !!ellipsis);

      const indIndex = columns.findIndex((column) => column.flag === 'INDEX');
      if (showIndexColumn && !isTreeTable) {
        pushIndexColumns = indIndex === -1;
      } else if (!showIndexColumn && !isTreeTable && indIndex !== -1) {
        columns.splice(indIndex, 1);
      }
    });

    if (pushIndexColumns) {
      const isFixedLeft = columns.some((item) => item.fixed === 'left');

      columns.unshift({
        flag: 'INDEX',
        width: 50,
        title: '序号',
        align: 'center',
        customRender: ({ index }) => {
          const getPagination = unref(getPaginationRef);
          if (isBoolean(getPagination)) {
            return `${index + 1}`;
          }
          const { current = 1, pageSize = PAGE_SIZE } = getPagination;
          const currentIndex = (current - 1) * pageSize + index + 1;
          return currentIndex;
        },
        ...(isFixedLeft
          ? {
              fixed: 'left',
            }
          : {}),
        ...indexColumnProps,
      });
    }
    if (actionColumn) {
      const hasIndex = columns.findIndex((column) => column.flag === 'ACTION');
      if (hasIndex === -1) {
        columns.push({
          ...columns[hasIndex],
          fixed: 'right',
          ...actionColumn,
          flag: 'ACTION',
        });
      }
    }
    return columns;
  });

  watchEffect(() => {
    const columns = toRaw(unref(propsRef).columns);
    columnsRef.value = columns;
    cacheColumnsRef.value = columns;
  });

  function handleItem(item: BasicColumn, ellipsis: boolean) {
    const { key, dataIndex } = item;
    item.align = item.align || 'center';
    if (ellipsis) {
      if (!key) {
        item.key = dataIndex;
      }
      if (!isBoolean(item.ellipsis)) {
        Object.assign(item, {
          ellipsis,
        });
      }
    }
  }

  function handleChildren(children: BasicColumn[] | undefined, ellipsis: boolean) {
    if (!children) return;
    children.forEach((item) => {
      const { children } = item;
      handleItem(item, ellipsis);
      handleChildren(children, ellipsis);
    });
  }

  function setColumns(columns: BasicColumn[] | string[]) {
    if (!isArray(columns)) return;

    if (columns.length <= 0) {
      columnsRef.value = [];
      return;
    }

    const firstColumn = columns[0];
    if (isObject(firstColumn)) {
      columnsRef.value = columns as any;
    } else {
      const newColumns = unref(cacheColumnsRef).filter((item) =>
        (columns as string[]).includes(`${item.key}`! || item.dataIndex!)
      );
      columnsRef.value = newColumns;
    }
  }

  return { getColumnsRef, setColumns };
}
