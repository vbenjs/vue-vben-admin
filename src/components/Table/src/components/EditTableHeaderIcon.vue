<template>
  <span>
    <slot></slot>
    {{ title }}
    <FormOutlined />
  </span>
</template>
<script lang="ts">
  import { FormOutlined } from '@vben/icons';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'EditTableHeaderIcon',
    components: { FormOutlined },
    props: { title: { type: String, default: '' } },
  });
</script>
