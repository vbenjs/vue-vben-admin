<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';
  import { Button } from 'ant-design-vue';
  import { useCountdown } from '@/hooks/event/useCountdown';
  import { isFunction } from '@/utils/is/index';

  interface Props {
    isBtn: boolean;
    count: number;
    beforeStartFunc: (...arg) => boolean;
  }
  export default defineComponent({
    name: 'CodeCountdown',
    props: {
      // 是否为倒计时按钮
      isBtn: {
        type: Boolean,
        default: false,
      },
      // 指定时间
      count: {
        type: Number,
        default: 60,
      },
      // 开始之前
      beforeStartFunc: {
        type: Function,
        default: null,
      },
    },
    setup(props: Props) {
      // 样式前缀
      const { prefixCls } = useDesign('count-down');

      const loadingRef = ref(false);

      const { countRef, startRef, start } = useCountdown(props.count);

      /**
       * @description: 执行之前判断有没有外置的函数,执行完之后在决定需不需要启动
       */
      async function handleStart() {
        const { beforeStartFunc } = props;
        if (beforeStartFunc && isFunction(beforeStartFunc)) {
          loadingRef.value = true;
          try {
            const res = await beforeStartFunc();
            res && start();
          } finally {
            loadingRef.value = false;
          }
        } else {
          start();
        }
      }
      return () => (
        <Button
          disabled={unref(startRef)}
          class={prefixCls}
          type={props.isBtn ? 'link' : 'link'}
          onClick={handleStart}
          loading={unref(loadingRef)}
        >
          {!unref(startRef) ? '获取验证码' : `${unref(countRef)} 秒后重新获取`}
        </Button>
      );
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-count-down';

  .@{prefix-cls} {
    font-size: 12px;
    cursor: pointer;
  }
</style>
