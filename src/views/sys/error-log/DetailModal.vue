<template>
  <BasicModal :width="800" :title="t('sys.errorLog.tableActionDesc')" v-bind="$attrs">
    <Description :data="info" @register="register" />
  </BasicModal>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { ErrorLogInfo } from '/#/store';

  import { defineComponent } from 'vue';
  import { BasicModal } from '/@/components/Modal/index';
  import { Description, useDescription } from '/@/components/Description/index';

  import { useI18n } from '/@/hooks/web/useI18n';

  import { getDescSchema } from './data';

  export default defineComponent({
    name: 'ErrorLogDetailModal',
    components: { BasicModal, Description },
    props: {
      info: {
        type: Object as PropType<ErrorLogInfo>,
        default: null,
      },
    },
    setup() {
      const { t } = useI18n();

      const [register] = useDescription({
        column: 2,
        schema: getDescSchema()!,
      });

      return {
        register,
        useI18n,
        t,
      };
    },
  });
</script>
