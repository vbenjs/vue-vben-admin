<script lang="tsx">
  import { BasicArrow, BasicTitle } from '@/components/Basic';
  import { useDesign } from '@/hooks/web/useDesign';
  import { PropType, computed, defineComponent, unref, type ExtractPropTypes } from 'vue';

  const collapseHeaderProps = {
    prefixCls: String,
    title: String,
    show: Boolean,
    canExpand: Boolean,
    helpMessage: {
      type: [Array, String] as PropType<string[] | string>,
      default: '',
    },
  };

  export type CollapseHeaderProps = ExtractPropTypes<typeof collapseHeaderProps>;

  export default defineComponent({
    name: 'CollapseHeader',
    inheritAttrs: false,
    props: collapseHeaderProps,
    emits: ['expand'],
    setup(props, { slots, attrs, emit }) {
      const { prefixCls } = useDesign('collapse-container');
      const _prefixCls = computed(() => props.prefixCls || unref(prefixCls));
      return () => (
        <div class={[`${unref(_prefixCls)}__header px-2 py-5`, attrs.class]}>
          <BasicTitle helpMessage={props.helpMessage} normal>
            {slots.title?.() || props.title}
          </BasicTitle>

          <div class={`${unref(_prefixCls)}__action`}>
            {slots.action
              ? slots.action({ expand: props.show, onClick: () => emit('expand') })
              : props.canExpand && (
                  <BasicArrow up expand={props.show} onClick={() => emit('expand')} />
                )}
          </div>
        </div>
      );
    },
  });
</script>
