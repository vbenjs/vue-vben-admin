<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Card } from 'ant-design-vue';

  export default defineComponent({
    setup() {
      return () => (
        <Card hoverable style="width: 240px;background:#fff;">
          <img
            slot="cover"
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
          <Card.Meta title="懒加载组件"></Card.Meta>
        </Card>
      );
    },
  });
</script>
