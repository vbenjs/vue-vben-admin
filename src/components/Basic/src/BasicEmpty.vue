<template>
  <Empty :image="image" :description="description" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Empty } from 'ant-design-vue';

  import emptySrc from '/@/assets/images/page_null.png';

  export default defineComponent({
    extends: Empty as any,
    components: { Empty },
    props: {
      description: {
        type: String,
        default: '暂无内容',
      },
      image: {
        type: String,
        default: emptySrc,
        required: false,
      },
    },
    setup() {
      return {};
    },
  });
</script>
