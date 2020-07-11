<script lang="tsx">
  // collapse 展开折叠
  import CollapseTransitionComponent from './collapse-transition';
  import { defineComponent } from 'compatible-vue';

  export default defineComponent({
    name: 'CollapseTransition',
    components: {
      CollapseTransitionComponent,
    },
    props: {
      // 是否打开折叠功能
      enable: {
        type: Boolean,
        default: true,
      },
    },
    setup(props, { slots }) {
      return () =>
        props.enable ? (
          <CollapseTransitionComponent>{slots.default()}</CollapseTransitionComponent>
        ) : (
          slots.default()
        );
    },
  });
</script>
