<template>
  <BasicModal :width="800" title="错误详情" v-bind="$attrs">
    <Description :data="info" @register="register" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { BasicModal } from '/@/components/Modal/index';
  import { ErrorInfo } from '/@/store/modules/error';
  import { Description, useDescription } from '/@/components/Description/index';
  import { getDescSchema } from './data';

  export default defineComponent({
    name: 'ErrorLogDetailModal',
    components: { BasicModal, Description },
    props: {
      info: {
        type: Object as PropType<ErrorInfo>,
        default: null,
      },
    },
    setup() {
      const [register] = useDescription({
        column: 2,
        schema: getDescSchema(),
      });
      return {
        register,
      };
    },
  });
</script>
