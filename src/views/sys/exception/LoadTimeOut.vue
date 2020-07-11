<script lang="tsx">
  import { defineComponent } from '@/setup/vue';
  import ErrorPage from '@/views/sys/exception/index.vue';

  import { ExceptionEnum } from '@/enums/exceptionEnum';

  export default defineComponent({
    name: 'LoadTimeout',
    setup() {
      return () => <ErrorPage status={ExceptionEnum.PAGE_TIMEOUT} />;
    },
  });
</script>
