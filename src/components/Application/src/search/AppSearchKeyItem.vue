<template>
  <span :class="$attrs.class">
    <Icon :icon="icon" />
  </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  export default defineComponent({
    components: { Icon },
    props: {
      icon: String,
    },
  });
</script>
