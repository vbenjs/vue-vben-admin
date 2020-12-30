import { BasicColumn, BasicTableProps, GetColumnsParams } from '../types/table';
import { PaginationProps } from '../types/pagination';
import { unref, ComputedRef, Ref, computed, watchEffect, ref, toRaw } from 'vue';
import { isBoolean, isArray, isString } from '/@/utils/is';
import { DEFAULT_ALIGN, PAGE_SIZE, INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG } from '../const';
import { useI18n } from '/@/hooks/web/useI18n';
import { isEqual, cloneDeep } from 'lodash-es';

const { t } = useI18n();

function handleItem(item: BasicColumn, ellipsis: boolean) {
  const { key, dataIndex, children } = item;
  item.align = item.align || DEFAULT_ALIGN;
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
  if (children && children.length) {
    handleChildren(children, !!ellipsis);
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

function handleIndexColumn(
  propsRef: ComputedRef<BasicTableProps>,
  getPaginationRef: ComputedRef<boolean | PaginationProps>,
  columns: BasicColumn[]
) {
  const { showIndexColumn, indexColumnProps } = unref(propsRef);

  let pushIndexColumns = false;
  columns.forEach((item) => {
    const { children } = item;

    const isTreeTable = children && children.length;

    const indIndex = columns.findIndex((column) => column.flag === INDEX_COLUMN_FLAG);

    if (showIndexColumn && !isTreeTable) {
      pushIndexColumns = indIndex === -1;
    } else if (!showIndexColumn && !isTreeTable && indIndex !== -1) {
      columns.splice(indIndex, 1);
    }
  });

  if (!pushIndexColumns) return;

  const isFixedLeft = columns.some((item) => item.fixed === 'left');

  columns.unshift({
    flag: INDEX_COLUMN_FLAG,
    width: 50,
    title: t('component.table.index'),
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

function handleActionColumn(propsRef: ComputedRef<BasicTableProps>, columns: BasicColumn[]) {
  const { actionColumn } = unref(propsRef);
  if (!actionColumn) return;

  const hasIndex = columns.findIndex((column) => column.flag === ACTION_COLUMN_FLAG);
  if (hasIndex === -1) {
    columns.push({
      ...columns[hasIndex],
      fixed: 'right',
      ...actionColumn,
      flag: ACTION_COLUMN_FLAG,
    });
  }
}

export function useColumns(
  propsRef: ComputedRef<BasicTableProps>,
  getPaginationRef: ComputedRef<boolean | PaginationProps>
) {
  const columnsRef = (ref(unref(propsRef).columns) as unknown) as Ref<BasicColumn[]>;
  let cacheColumns = unref(propsRef).columns;

  const getColumnsRef = computed(() => {
    const columns = unref(columnsRef);

    handleIndexColumn(propsRef, getPaginationRef, columns);
    handleActionColumn(propsRef, columns);
    if (!columns) {
      return [];
    }
    const { ellipsis } = unref(propsRef);

    columns.forEach((item) => {
      const { customRender, slots } = item;

      handleItem(
        item,
        Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !customRender && !slots
      );
    });
    return columns;
  });

  const getSortFixedColumns = computed(() => {
    return useFixedColumn(unref(getColumnsRef));
  });

  watchEffect(() => {
    const columns = toRaw(unref(propsRef).columns);
    columnsRef.value = columns;
    cacheColumns = columns?.filter((item) => !item.flag) ?? [];
  });

  /**
   * set columns
   * @param columnList key｜column
   */
  function setColumns(columnList: Partial<BasicColumn>[] | string[]) {
    const columns = cloneDeep(columnList);
    if (!isArray(columns)) return;

    if (columns.length <= 0) {
      columnsRef.value = [];
      return;
    }

    const firstColumn = columns[0];

    const cacheKeys = cacheColumns.map((item) => item.dataIndex);

    if (!isString(firstColumn)) {
      columnsRef.value = columns as BasicColumn[];
    } else {
      const columnKeys = columns as string[];
      const newColumns: BasicColumn[] = [];
      cacheColumns.forEach((item) => {
        if (columnKeys.includes(`${item.key}`! || item.dataIndex!)) {
          newColumns.push({
            ...item,
            defaultHidden: false,
          });
        }
      });
      // Sort according to another array
      if (!isEqual(cacheKeys, columns)) {
        newColumns.sort((prev, next) => {
          return (
            columnKeys.indexOf(prev.dataIndex as string) -
            columnKeys.indexOf(next.dataIndex as string)
          );
        });
      }
      columnsRef.value = newColumns;
    }
  }

  function getColumns(opt?: GetColumnsParams) {
    const { ignoreIndex, ignoreAction, sort } = opt || {};
    let columns = toRaw(unref(getColumnsRef));
    if (ignoreIndex) {
      columns = columns.filter((item) => item.flag !== INDEX_COLUMN_FLAG);
    }
    if (ignoreAction) {
      columns = columns.filter((item) => item.flag !== ACTION_COLUMN_FLAG);
    }

    if (sort) {
      columns = useFixedColumn(columns);
    }

    return columns;
  }
  function getCacheColumns() {
    return cacheColumns;
  }

  return { getColumnsRef, getCacheColumns, getColumns, setColumns, getSortFixedColumns };
}

export function useFixedColumn(columns: BasicColumn[]) {
  const fixedLeftColumns: BasicColumn[] = [];
  const fixedRightColumns: BasicColumn[] = [];
  const defColumns: BasicColumn[] = [];
  for (const column of columns) {
    if (column.fixed === 'left') {
      fixedLeftColumns.push(column);
      continue;
    }
    if (column.fixed === 'right') {
      fixedRightColumns.push(column);
      continue;
    }
    defColumns.push(column);
  }
  const resultColumns = [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(
    (item) => !item.defaultHidden
  );

  return resultColumns;
}
