<script lang="tsx">
  import { fileListProps } from '../props';
  import { isFunction, isDef } from '@/utils/is';
  import { useSortable } from '@/hooks/web/useSortable';
  import { useModalContext } from '@/components/Modal/src/hooks/useModalContext';
  import { defineComponent, CSSProperties, watch, nextTick, ref, onMounted } from 'vue';
  import { FileBasicColumn } from '../types/typing';

  export default defineComponent({
    name: 'FileList',
    props: fileListProps,
    setup(props, { emit }) {
      const modalFn = useModalContext();
      const sortableContainer = ref<HTMLTableSectionElement>();

      watch(
        () => props.dataSource,
        () => {
          nextTick(() => {
            modalFn?.redoModalHeight?.();
          });
        },
      );

      if (props.openDrag) {
        onMounted(() =>
          useSortable(sortableContainer, {
            ...props.dragOptions,
            onEnd: ({ oldIndex, newIndex }) => {
              // position unchanged
              if (oldIndex === newIndex) {
                return;
              }
              const { onAfterEnd } = props.dragOptions;

              if (isDef(oldIndex) && isDef(newIndex)) {
                const data = [...props.dataSource];

                const [oldItem] = data.splice(oldIndex, 1);
                data.splice(newIndex, 0, oldItem);

                nextTick(() => {
                  emit('update:dataSource', data);

                  isFunction(onAfterEnd) && onAfterEnd(data);
                });
              }
            },
          }).initSortable(),
        );
      }

      return () => {
        const { columns, actionColumn, dataSource } = props;
        let columnList: FileBasicColumn[];
        columnList = (
          actionColumn ? [...columns, actionColumn] : [...columns]
        ) as FileBasicColumn[];

        return (
          // x scrollbar
          <div class="overflow-x-auto">
            <table class="file-table">
              <colgroup>
                {columnList.map((item) => {
                  const { width = 0, dataIndex } = item;
                  const style: CSSProperties = {
                    width: `${width}px`,
                    minWidth: `${width}px`,
                  };
                  return <col style={width ? style : {}} key={dataIndex} />;
                })}
              </colgroup>
              <thead>
                <tr class="file-table-tr">
                  {columnList.map((item) => {
                    const { title = '', align = 'center', dataIndex } = item;
                    return (
                      <th class={['file-table-th', align]} key={dataIndex}>
                        {title}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody ref={sortableContainer}>
                {dataSource.map((record = {}, index) => {
                  return (
                    <tr class="file-table-tr" key={`${index + record.name || ''}`}>
                      {columnList.map((item) => {
                        const { dataIndex = '', customRender, align = 'center' } = item;
                        const render = customRender && isFunction(customRender);
                        return (
                          <td class={['file-table-td break-all', align]} key={dataIndex}>
                            {render
                              ? customRender?.({ text: record[dataIndex], record })
                              : record[dataIndex]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  .file-table {
    width: 100%;
    border-collapse: collapse;

    .center {
      text-align: center;
    }

    .left {
      text-align: left;
    }

    .right {
      text-align: right;
    }

    &-th,
    &-td {
      padding: 12px 8px;
    }

    thead {
      background-color: @background-color-light;
    }

    table,
    td,
    th {
      border: 1px solid @border-color-base;
    }
  }
</style>
