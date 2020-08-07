<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';
  import { Icon } from '@/components/icon/index';
  export default defineComponent({
    name: 'EditTableHeaderIcon',
    props: {
      title: {
        type: String,
        default: '',
      } as PropOptions<string>,
    },
    setup(props) {
      return () => {
        return (
          <span>
            {props.title}
            <Icon class="ml-2" type="form" />
          </span>
        );
      };
    },
  });
</script>
