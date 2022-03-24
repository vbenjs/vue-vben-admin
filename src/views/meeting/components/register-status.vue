<script lang="tsx">
  import { defineComponent } from 'vue';
  import { Tag } from 'ant-design-vue';

  export default defineComponent({
    name: 'RegisterStatus',
    props: {
      registerStatus: {
        type: String,
      },
    },
    setup(props) {
      function renderStatus() {
        switch (props.registerStatus) {
          case 'started':
            return <Tag color="success">报名中</Tag>;
          case 'future':
            return <Tag color="default">筹备中</Tag>;
          case 'end':
            return <Tag color="warning">报名结束</Tag>;
        }
      }

      return () => {
        return renderStatus();
      };
    },
  });
</script>

<style></style>
