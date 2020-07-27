<script lang="tsx">
  import { defineComponent, watch, ref, unref } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  import DetailModal from './DetailModal.vue';
  import { useModal } from '@/components/modal/index';

  import { useDesign } from '@/hooks/core/useDesign';

  import { BasicTable, useTable } from '@/components/table/index';

  import { errorStore, ErrorInfo } from '@/store/modules/error';

  import { fireErrorApi } from '@/api/demo/error';

  import { getColumns } from './data';

  const { prefixCls } = useDesign('error-handle');

  export default defineComponent({
    name: 'ErrorHandler',
    setup() {
      const rowInfoRef = ref<ErrorInfo>();
      const imgListRef = ref<string[]>([]);
      const [register, { setTableData }] = useTable({
        titleHelpMessage: '只在`/src/settings/projectSetting.ts` 内的useErrorHandle=true时生效！',
        title: '错误日志列表',
        columns: getColumns(),
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          customRender: (text: string, recoed: ErrorInfo) => {
            return (
              <Button type="link" size="small" onClick={handleDetail.bind(null, recoed)}>
                详情
              </Button>
            );
          },
        },
      });

      const [registerModal, { isFirstLoadRef, openModal }] = useModal();
      watch(
        () => errorStore.getErrorInfoState,
        (list) => {
          setTableData(list);
        }
      );

      // 查看详情
      function handleDetail(row: ErrorInfo) {
        rowInfoRef.value = row;
        openModal({
          visible: true,
        });
      }

      function fireVueError() {
        throw new Error('fire vue error!');
      }

      function fireResourceError() {
        imgListRef.value.push(`${new Date().getTime()}.png`);
      }

      async function fireAjaxError() {
        await fireErrorApi();
      }

      return () => (
        <div class={[prefixCls, 'p-4']}>
          {unref(imgListRef).map((src) => {
            return <img src={src} key={src} v-show={false} />;
          })}
          {!unref(isFirstLoadRef) && (
            <DetailModal info={unref(rowInfoRef)} onRegister={registerModal} />
          )}
          <BasicTable onRegister={register} class={`${prefixCls}-table`}>
            <template slot="toolbar">
              <Button onClick={fireVueError} type="primary">
                点击触发vue错误
              </Button>
              <Button onClick={fireResourceError} type="primary">
                点击触发resource错误
              </Button>
              <Button onClick={fireAjaxError} type="primary">
                点击触发ajax错误
              </Button>
            </template>
          </BasicTable>
        </div>
      );
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-error-handle';

  .@{prefix-cls} {
    &-table {
      background: #fff;
    }
  }
</style>
