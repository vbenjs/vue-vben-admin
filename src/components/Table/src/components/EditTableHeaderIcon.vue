<template>
  <span>
    <slot></slot>
    {{ title }}
    <FormOutlined />
  </span>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { FormOutlined } from '@ant-design/icons-vue';
  export default defineComponent({
    name: 'EditTableHeaderIcon',
    components: { FormOutlined },
    props: {
      title: {
        type: String as PropType<string>,
        default: '',
      },
    },
  });
</script>
