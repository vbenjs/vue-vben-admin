import { defineComponent } from 'vue';
import { fileListProps } from './props';
import { isFunction } from '/@/utils/is';
import './FileList.less';

export default defineComponent({
  name: 'FileList',
  props: fileListProps,
  setup(props) {
    return () => {
      const { columns, actionColumn, dataSource } = props;

      return (
        <table class="file-table">
          <colgroup>
            {[...columns, actionColumn].map((item) => {
              const { width = 0 } = item;
              return width ? (
                <col style={'width:' + width + 'px;min-width:' + width + 'px;'} />
              ) : (
                <col />
              );
            })}
          </colgroup>
          <thead>
            <tr class="file-table-tr">
              {[...columns, actionColumn].map((item) => {
                const { title = '', align = 'center' } = item;
                return <th class={['file-table-th', align]}>{title}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((record = {}) => {
              return (
                <tr class="file-table-tr">
                  {[...columns, actionColumn].map((item) => {
                    const { dataIndex = '', customRender, align = 'center' } = item;
                    if (customRender && isFunction(customRender)) {
                      return (
                        <td class={['file-table-td', align]}>
                          {customRender({ text: record[dataIndex], record })}
                        </td>
                      );
                    } else {
                      return <td class={['file-table-td', align]}>{record[dataIndex]}</td>;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    };
  },
});
