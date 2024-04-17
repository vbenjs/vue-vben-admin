<script lang="tsx">
  import { CollapseTransition } from '@/components/Transition';
  import { useDesign } from '@/hooks/web/useDesign';
  import { triggerWindowResize } from '@/utils/event';
  import { useTimeoutFn } from '@vben/hooks';
  import { Skeleton } from 'ant-design-vue';
  import { isNil } from 'lodash-es';
  import { defineComponent, ref, unref, type ExtractPropTypes, type PropType } from 'vue';
  import CollapseHeader from './CollapseHeader.vue';

  const collapseContainerProps = {
    title: { type: String, default: '' },
    loading: { type: Boolean },
    /**
     *  Can it be expanded
     */
    canExpand: { type: Boolean, default: true },
    /**
     * Warm reminder on the right side of the title
     */
    helpMessage: {
      type: [Array, String] as PropType<string[] | string>,
      default: '',
    },
    /**
     * Whether to trigger window.resize when expanding and contracting,
     * Can adapt to tables and forms, when the form shrinks, the form triggers resize to adapt to the height
     */
    triggerWindowResize: { type: Boolean },
    /**
     * Delayed loading time
     */
    lazyTime: { type: Number, default: 0 },
  };

  export type CollapseContainerProps = ExtractPropTypes<typeof collapseContainerProps>;

  export default defineComponent({
    name: 'CollapseContainer',

    props: collapseContainerProps,

    setup(props, { expose, slots }) {
      const { prefixCls } = useDesign('collapse-container');

      const show = ref(true);

      const handleExpand = (val: boolean) => {
        show.value = isNil(val) ? !show.value : val;
        if (props.triggerWindowResize) {
          // 200 milliseconds here is because the expansion has animation,
          useTimeoutFn(triggerWindowResize, 200);
        }
      };

      expose({ handleExpand });

      return () => (
        <div class={unref(prefixCls)}>
          <CollapseHeader
            {...props}
            prefixCls={unref(prefixCls)}
            onExpand={handleExpand}
            show={show.value}
            v-slots={{
              title: slots.title,
              action: slots.action,
            }}
          />

          <div class="p-2">
            <CollapseTransition enable={props.canExpand}>
              {props.loading ? (
                <Skeleton active={props.loading} />
              ) : (
                <div class={`${prefixCls}__body`} v-show={show.value}>
                  {slots.default?.()}
                </div>
              )}
            </CollapseTransition>
          </div>

          {slots.footer && <div class={`${prefixCls}__footer`}>{slots.footer()}</div>}
        </div>
      );
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-collapse-container';

  .@{prefix-cls} {
    transition: all 0.3s ease-in-out;
    border-radius: 2px;
    background-color: @component-background;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      border-bottom: 1px solid @border-color-light;
    }

    &__footer {
      border-top: 1px solid @border-color-light;
    }

    &__action {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
      text-align: right;
    }
  }
</style>
