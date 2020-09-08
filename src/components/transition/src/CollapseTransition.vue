<script lang="tsx">
  // collapse 展开折叠
  import { ExpandTransition } from '../index';
  import { defineComponent, PropOptions } from 'compatible-vue';
  export default defineComponent({
    name: 'CollapseTransition',
    components: {
      ExpandTransition,
    },
    props: {
      // 是否打开折叠功能
      enable: {
        type: Boolean,
        default: true,
      } as PropOptions<boolean>,
    },
    setup(props, { slots }) {
      return () =>
        props.enable ? <ExpandTransition>{slots.default()}</ExpandTransition> : slots.default();
    },
  });
</script>
