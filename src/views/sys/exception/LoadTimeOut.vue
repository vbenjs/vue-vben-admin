<template>
  <Exception :status="ExceptionEnum.PAGE_TIMEOUT" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Exception } from '/@/views/sys/exception';

  import { ExceptionEnum } from '/@/enums/exceptionEnum';

  export default defineComponent({
    name: 'LoadTimeout',
    components: { Exception },
    setup() {
      return { ExceptionEnum };
    },
  });
</script>
