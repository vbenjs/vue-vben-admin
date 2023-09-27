<script lang="tsx">
  import type { PropType } from 'vue';
  import type { BasicColumn } from '../types/table';
  import { defineComponent, computed } from 'vue';
  import BasicHelp from '/@/components/Basic/src/BasicHelp.vue';
  import EditTableHeaderCell from './EditTableHeaderIcon.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'TableHeaderCell',
    components: {
      EditTableHeaderCell,
      BasicHelp,
    },
    props: {
      column: {
        type: Object as PropType<BasicColumn>,
        default: () => ({}),
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-table-header-cell');

      const getIsEdit = computed(() => !!props.column?.edit);
      const getTitle = computed(() => {
        const column = props.column;
        if (typeof column.customHeaderRender === 'function') {
          return column.customHeaderRender(props.column);
        }
        return props.column?.customTitle || props.column?.title;
      });
      const getHelpMessage = computed(() => props.column?.helpMessage);

      return () => {
        return (
          <div>
            {getIsEdit.value ? (
              <EditTableHeaderCell>{getTitle.value}</EditTableHeaderCell>
            ) : (
              <span class="default-header-cell">{getTitle.value}</span>
            )}
            {getHelpMessage.value && (
              <BasicHelp text={getHelpMessage.value} class={`${prefixCls}__help`} />
            )}
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-header-cell';

  .@{prefix-cls} {
    &__help {
      margin-left: 8px;
      color: rgb(0 0 0 / 65%) !important;
    }
  }
</style>
