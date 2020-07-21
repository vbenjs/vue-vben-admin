<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Alert } from 'ant-design-vue';
  import { Description, DescItem, useDescription } from '@/components/description/index';
  const mockData = {
    username: 'vben',
    nickName: 'VB',
    age: 25,
    phone: '15695909xxx',
    email: '190848757@qq.com',
    addr: '厦门市思明区观日路18号',
    sex: '男',
    certy: '350425619951007xxxx',
    tag: 'orange',
  };
  const schema: DescItem[] = [
    {
      field: 'username',
      label: '用户名',
    },
    {
      field: 'nickName',
      label: '昵称',
    },
    {
      field: 'phone',
      label: '联系电话',
    },
    {
      field: 'email',
      label: '邮箱',
    },
    {
      field: 'addr',
      label: '地址',
    },
  ];
  export default defineComponent({
    name: 'DescDemo',
    setup() {
      const [register] = useDescription({
        title: '基础示例',
        collapseOptions: {
          canExpand: true,
          helpMessage: 'help me',
        },
        column: 3,
        data: mockData,
        schema: schema,
      });
      const [register1] = useDescription({
        title: '垂直示例',
        layout: 'vertical',
        collapseOptions: {
          canExpand: true,
          helpMessage: 'help me',
        },
        column: 2,
        data: mockData,
        schema: schema,
      });

      const [register2] = useDescription({
        title: '无边框示例',
        bordered: false,
        data: mockData,
        schema: schema,
      });

      return () => (
        <div class="p-4">
          <Alert message="二次封装Desc组件，提供useDescription 函数方便调用" />
          <Description onRegister={register} class="m-2" />

          <Description onRegister={register1} class="m-2" />
          <Description onRegister={register2} class="m-2" />
        </div>
      );
    },
  });
</script>
