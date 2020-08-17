<script lang="tsx">
  import { defineComponent, computed, PropOptions, unref } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  import { extendSlots } from '@/utils/helper/tsxHelper';
  import { useThrottle } from '@/hooks/core/useThrottle';
  import { isFunction } from '@/utils/is';
  export default defineComponent({
    name: 'GButton',
    inheritAttrs: false,
    props: {
      // 按钮类型
      type: {
        type: String,
        default: 'default',
      } as PropOptions<'primary' | 'default' | 'danger'>,
      // 节流防抖类型 throttle debounce
      throttle: {
        type: String,
        default: 'throttle',
      } as PropOptions<'throttle' | 'debounce'>,
      color: {
        type: String,
        default: '',
      } as PropOptions<string>,
      // 防抖节流时间
      throttleTime: {
        type: Number,
        default: 300,
      } as PropOptions<number>,
      loading: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
      disabled: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
    },
    setup(props, { listeners, attrs, slots }) {
      const getBindValues = computed(() => {
        const bindData = { ...attrs, ...props };
        return {
          props: bindData,
          attrs: bindData,
        };
      });

      const getListeners = computed(() => {
        const { throttle, throttleTime } = props;
        // 是否开启节流防抖
        const throttleType = throttle!.toLowerCase();
        const isDebounce = throttleType === 'debounce';
        const openThrottle = ['throttle', 'debounce'].includes(throttleType);

        const on: {
          click?: (...any) => any;
        } = {};

        if (listeners.click && isFunction(listeners.click) && openThrottle) {
          const [handler] = useThrottle(listeners.click as any, throttleTime!, {
            debounce: isDebounce,
            immediate: true,
          });
          on.click = handler;
        }

        return {
          ...listeners,
          ...on,
        };
      });

      const getColor = computed(() => {
        const res: string[] = [];
        const { color, disabled } = props;
        color && res.push(`ant-btn-${color}`);
        disabled && res.push('is-disabled');
        return res;
      });
      return () => {
        return (
          <Button class={unref(getColor)} on={unref(getListeners)} {...unref(getBindValues)}>
            {extendSlots(slots)}
          </Button>
        );
      };
    },
  });
</script>
