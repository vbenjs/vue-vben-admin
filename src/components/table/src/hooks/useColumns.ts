import { BasicTableProps, BasicColumn } from '../types/table';
import { PaginationProps } from '../types/pagination';
import { unref, ComputedRef, computed, watch, ref } from 'compatible-vue';
import { isBoolean, isArray, isObject } from '@/utils/is/index';
import { PAGE_SIZE } from '../const';
import { useProps } from './useProps';

export function useColumns(
  refProps: ComputedRef<BasicTableProps>,
  getPaginationRef: ComputedRef<false | PaginationProps>
) {
  const { propsRef } = useProps(refProps);
  const columnsRef = ref<BasicColumn[]>(unref(propsRef).columns);
  const cacheColumnsRef = ref<BasicColumn[]>(unref(propsRef).columns);

  watch(
    () => unref(propsRef).columns,
    (columns) => {
      columnsRef.value = columns;
      cacheColumnsRef.value = columns;
    },
    {
      immediate: true,
    }
  );
  const getColumnsRef = computed(() => {
    const props = unref(propsRef);
    const { showIndexColumn, indexColumnProps, ellipsis, actionColumn, isTreeTable } = props;
    const columns = unref(columnsRef);
    if (!columns) {
      return [];
    }
    let pushActionColumns = false;
    let pushIndexColumns = false;
    columns.forEach((item) => {
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
      const actionIndex = columns.findIndex((column) => column.flag === 'ACTION');
      if (actionColumn) {
        pushActionColumns = actionIndex === -1;
      } else if (actionIndex !== -1) {
        columns.splice(actionIndex, 1);
      }
      const indIndex = columns.findIndex((column) => column.flag === 'INDEX');
      if (showIndexColumn && !isTreeTable) {
        pushIndexColumns = indIndex === -1;
      } else if (!showIndexColumn && !isTreeTable && indIndex !== -1) {
        columns.splice(indIndex, 1);
      }
    });
    // if (showIndexColumn && !isTreeTable) {
    //   const isFixedLeft = columns.some((item) => item.fixed === 'left');
    //   const hasIndex = columns.find((column) => column.flag === 'INDEX');
    //   !hasIndex &&
    //     columns.unshift({
    //       flag: 'INDEX',
    //       width: 50,
    //       title: '序号',
    //       align: 'center',
    //       customRender: (text: string, record: any, index: number) => {
    //         const getPagination = unref(getPaginationRef);
    //         if (isBoolean(getPagination)) {
    //           return `${index + 1}`;
    //         }
    //         const { current = 1, pageSize = PAGE_SIZE } = getPagination;
    //         const currentIndex = (current - 1) * pageSize + index + 1;
    //         return currentIndex;
    //       },
    //       ...(isFixedLeft
    //         ? {
    //             fixed: 'left',
    //           }
    //         : {}),
    //       ...indexColumnProps,
    //     });
    // }
    pushActionColumns &&
      columns.push({
        fixed: 'right',
        ...actionColumn,
        flag: 'ACTION',
      });
    if (pushIndexColumns) {
      const isFixedLeft = columns.some((item) => item.fixed === 'left');

      columns.unshift({
        flag: 'INDEX',
        width: 50,
        title: '序号',
        align: 'center',
        customRender: (text: string, record: any, index: number) => {
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
    // if (ellipsis) {
    //   columns.forEach((item) => {
    //     const { key, dataIndex } = item;
    //     if (!key) {
    //       item.key = dataIndex;
    //     }
    //     if (!isBoolean(item.ellipsis)) {
    //       Object.assign(item, {
    //         ellipsis,
    //       });
    //     }
    //   });
    // }

    // if (actionColumn) {
    //   const hasIndex = columns.find((column) => column.flag === 'ACTION');
    //   !hasIndex &&
    //     columns.push({
    //       fixed: 'right',
    //       ...actionColumn,
    //       flag: 'ACTION',
    //     });
    // }
    return columns;
  });

  function setColumns(columns: BasicColumn[] | string[]) {
    if (!isArray(columns)) {
      return;
    }
    if (columns.length <= 0) {
      columnsRef.value = [];
      return;
    }

    const firstColumn = columns[0];
    if (isObject(firstColumn)) {
      columnsRef.value = columns as BasicColumn[];
    } else {
      const newColumns = unref(cacheColumnsRef).filter((item) =>
        (columns as string[]).includes(item.key! || item.dataIndex!)
      );
      columnsRef.value = newColumns;
    }
  }

  return { getColumnsRef, setColumns };
}
