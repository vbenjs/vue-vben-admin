<template>
  <span>
    <slot></slot>
    {{ title }}
    <FormOutlined />
  </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { FormOutlined } from '@ant-design/icons-vue';

  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'EditTableHeaderIcon',
    components: { FormOutlined },
    props: {
      title: propTypes.string.def(''),
    },
  });
</script>
