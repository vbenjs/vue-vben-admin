<template>
  <Button v-bind="$attrs" :disabled="isStart" @click="handleStart" :loading="loading">
    {{
      !isStart
        ? t('component.countdown.normalText')
        : t('component.countdown.sendText', [currentCount])
    }}
  </Button>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, watchEffect } from 'vue';

  import { Button } from 'ant-design-vue';

  import { useCountdown } from './useCountdown';
  import { isFunction } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'CountButton',
    components: { Button },
    props: {
      value: propTypes.any,
      count: propTypes.number.def(60),
      beforeStartFunc: {
        type: Function as PropType<() => boolean>,
        default: null,
      },
    },
    setup(props) {
      const loading = ref(false);

      const { currentCount, isStart, start, reset } = useCountdown(props.count);
      const { t } = useI18n();

      watchEffect(() => {
        props.value === undefined && reset();
      });
      /**
       * @description: Judge whether there is an external function before execution, and decide whether to start after execution
       */
      async function handleStart() {
        const { beforeStartFunc } = props;
        if (beforeStartFunc && isFunction(beforeStartFunc)) {
          loading.value = true;
          try {
            const canStart = await beforeStartFunc();
            canStart && start();
          } finally {
            loading.value = false;
          }
        } else {
          start();
        }
      }
      return { handleStart, isStart, currentCount, loading, t };
    },
  });
</script>
