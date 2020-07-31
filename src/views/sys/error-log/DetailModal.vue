<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';
  import { BasicModal } from '@/components/modal/index';
  import { ErrorInfo } from '@/store/modules/error';
  import { Description, useDescription } from '@/components/description/index';
  import { getDescSchema } from './data';

  export default defineComponent({
    name: 'ErrorLogDetailModal',
    props: {
      info: {
        type: Object,
        default: null,
      } as PropOptions<ErrorInfo>,
    },
    setup(props, { listeners }) {
      const [register] = useDescription({
        column: 2,
        schema: getDescSchema(),
      });
      return () => {
        return (
          <BasicModal width={800} title="错误详情" on={listeners}>
            <Description data={props.info} onRegister={register} />
          </BasicModal>
        );
      };
    },
  });
</script>
