<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  import { useDesign } from '@/hooks/core/useDesign';

  import printJS from 'print-js';
  export default defineComponent({
    name: 'PrintBaseDemo',
    setup() {
      const { prefixCls } = useDesign('print-base');
      function handlePrint() {
        printJS({ printable: 'table', type: 'html' });
      }
      return () => (
        <div class={prefixCls}>
          <Button type="primary" onClick={handlePrint}>
            打印表格
          </Button>
          <table
            border="1"
            id="table"
            style={{ 'border-width': '1px', borderCollapse: 'collapse', 'border-spacing': 0 }}
          >
            <thead>
              <tr>
                <th>标题1</th>
                <th>标题2</th>
                <th>标题3</th>
                <th>标题4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>内容1</td>
                <td>内容2</td>
                <td>内容3</td>
                <td>内容4</td>
              </tr>
              <tr>
                <td>内容1</td>
                <td>内容2</td>
                <td>内容3</td>
                <td>内容4</td>
              </tr>
              <tr>
                <td>内容1</td>
                <td>内容2</td>
                <td>内容3</td>
                <td>内容4</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-print-base';

  .@{prefix-cls} {
    position: relative;
    width: 100%;
    padding: 20px;

    table {
      margin-top: 10px;
    }

    th,
    td {
      padding: 6px 10px;
    }
  }
</style>
