<script lang="tsx">
  import { defineComponent, watch, ref, unref } from 'compatible-vue';
  import { Tag } from 'ant-design-vue';

  import { useDesign } from '@/hooks/core/useDesign';

  import { BasicTable, useTable, BasicColumn } from '@/components/table/index';

  import { errorStore, ErrorTypeEnum } from '@/store/modules/error';

  import { fireErrorApi } from '@/api/demo/error';

  const { prefixCls } = useDesign('error-handle');

  const columns: BasicColumn[] = [
    {
      dataIndex: 'type',
      title: '类型',
      width: 80,
      customRender: (text: string) => {
        const color =
          text === ErrorTypeEnum.VUE
            ? 'green'
            : text === ErrorTypeEnum.RESOURCE
            ? 'cyan'
            : text === ErrorTypeEnum.PROMISE
            ? 'blue'
            : ErrorTypeEnum.AJAX
            ? 'red'
            : 'purple';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      dataIndex: 'url',
      title: '地址',
      width: 200,
    },
    {
      dataIndex: 'time',
      title: '时间',
      width: 160,
    },
    {
      dataIndex: 'file',
      title: '文件',
      width: 200,
    },
    {
      dataIndex: 'name',
      title: 'Name',
      width: 200,
    },
    {
      dataIndex: 'message',
      title: '错误信息',
      width: 300,
    },
    {
      dataIndex: 'stack',
      title: 'stack信息',
      width: 300,
    },
  ];
  export default defineComponent({
    setup() {
      const imgListRef = ref<string[]>([]);
      const [register, { setTableData }] = useTable({
        titleHelpMessage: '只在`/src/settings/projectSetting.ts` 内的useErrorHandle=true生效！',
        title: '错误日志列表',
        columns: columns,
      });
      watch(
        () => errorStore.getErrorInfoState,
        (list) => {
          setTableData(list);
        }
      );
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
          <BasicTable onRegister={register} class={`${prefixCls}-table`}>
            <template slot="toolbar">
              <a-button onClick={fireVueError} type="primary">
                点击触发vue错误
              </a-button>
              <a-button onClick={fireResourceError} type="primary">
                点击触发resource错误
              </a-button>
              <a-button onClick={fireAjaxError} type="primary">
                点击触发ajax错误
              </a-button>
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
