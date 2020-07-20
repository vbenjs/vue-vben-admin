<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';

  export default defineComponent({
    name: 'TestComp',
    props: {
      value: {
        type: String,
        default: '',
      } as PropOptions<string>,
    },
    setup(props, { emit }) {
      return () => (
        <div>
          <input
            value={props.value}
            onInput={(v) => {
              emit('change', v);
            }}
          />
        </div>
      );
    },
  });
</script>
