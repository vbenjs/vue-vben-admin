<template>
  <div class="p-4">
    <template v-for="src in imgListRef" :key="src">
      <img :src="src" v-show="false" />
    </template>
    <DetailModal :info="rowInfoRef" @register="registerModal" />
    <BasicTable @register="register" class="error-handle-table">
      <template #toolbar>
        <a-button @click="fireVueError" type="primary"> 点击触发vue错误 </a-button>
        <a-button @click="fireResourceError" type="primary"> 点击触发resource错误 </a-button>
        <a-button @click="fireAjaxError" type="primary"> 点击触发ajax错误 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[{ label: '详情', onClick: handleDetail.bind(null, record) }]" />
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts">
  import { defineComponent, watch, ref, nextTick } from 'vue';

  import DetailModal from './DetailModal.vue';
  import { useModal } from '/@/components/Modal/index';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicTable, useTable, TableAction } from '/@/components/Table/index';

  import { errorStore, ErrorInfo } from '/@/store/modules/error';

  import { fireErrorApi } from '/@/api/demo/error';

  import { getColumns } from './data';

  import { cloneDeep } from 'lodash-es';
  import { isDevMode } from '/@/utils/env';

  export default defineComponent({
    name: 'ErrorHandler',
    components: { DetailModal, BasicTable, TableAction },
    setup() {
      const rowInfoRef = ref<ErrorInfo>();
      const imgListRef = ref<string[]>([]);

      const [register, { setTableData }] = useTable({
        title: '错误日志列表',
        columns: getColumns(),
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });
      const [registerModal, { openModal }] = useModal();

      watch(
        () => errorStore.getErrorInfoState,
        (list) => {
          nextTick(() => {
            setTableData(cloneDeep(list));
          });
        },
        {
          immediate: true,
        }
      );
      const { createMessage } = useMessage();
      if (isDevMode()) {
        createMessage.info('只在`/src/settings/projectSetting.ts` 内的useErrorHandle=true时生效！');
      }
      // 查看详情
      function handleDetail(row: ErrorInfo) {
        rowInfoRef.value = row;
        openModal(true);
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

      return {
        register,
        registerModal,
        handleDetail,
        fireVueError,
        fireResourceError,
        fireAjaxError,
        imgListRef,
        rowInfoRef,
      };
    },
  });
</script>
