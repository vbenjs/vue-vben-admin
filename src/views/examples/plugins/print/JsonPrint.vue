<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  import { useDesign } from '@/hooks/core/useDesign';

  import printJS from 'print-js';

  const jsonData: any[] = [
    {
      name: 'John Doe',
      email: 'john@doe.com',
      phone: '111-111-1111',
    },
    {
      name: 'Barry Allen',
      email: 'barry@flash.com',
      phone: '222-222-2222',
    },
    {
      name: 'Cool Dude',
      email: 'cool@dude.com',
      phone: '333-333-3333',
    },
  ];

  export default defineComponent({
    name: 'PrintJsonDemo',
    setup() {
      const { prefixCls } = useDesign('print-json');
      function handlePrint() {
        printJS({ printable: jsonData, properties: ['name', 'email', 'phone'], type: 'json' });
      }
      return () => (
        <div class={prefixCls}>
          <Button type="primary" onClick={handlePrint}>
            打印JSON
          </Button>
        </div>
      );
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-print-json';

  .@{prefix-cls} {
    position: relative;
    padding: 20px;
  }
</style>
