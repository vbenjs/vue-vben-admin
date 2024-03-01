<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="1000"
    destroyOnClose
    @close="dataSource = []"
  >
    <template v-if="showTable">
      <div class="h-300px">
        <CodeEditor :value="origin" />
      </div>
      <BasicTable @register="registerTable" class="!p-0" />
    </template>
    <template v-else>
      <CodeEditor :value="origin" />
    </template>
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { ref, computed, Ref } from 'vue';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';

  import { BasicColumn, BasicTable, useTable } from '@/components/Table';
  import { CodeEditor } from '@/components/CodeEditor';
  import { formatToDateTime } from '@/utils/dateUtil';

  import { LastValue } from '@/views/common/components';

  defineEmits(['success', 'register']);

  const getTitle = computed(() => {
    return '查看数据';
  });

  const wnColums: BasicColumn[] = [
    {
      dataIndex: 'uuid',
      title: '网关编号',
      minWidth: 200,
    },
    { dataIndex: 'id', title: '节点编号', width: 100 },
    {
      dataIndex: 'ts',
      title: '接收时间',
      width: 180,
      customRender: ({ text }) => formatToDateTime(text),
    },
    {
      dataIndex: 'value',
      title: '值',
      width: 200,
      customRender: ({ text }) => <LastValue data={text} />,
    },
    { dataIndex: 'bat', title: '电量(0-6)', width: 100 },
  ];

  const MultiBusColumns: BasicColumn[] = [
    { dataIndex: 'nodeNumber', title: '16进制节点编号' },
    { dataIndex: 'nodeNumber10', title: '10进制节点编号' },
    { dataIndex: 'nodeData', title: '节点数据' },
    { dataIndex: 'electric', title: '电流(A)' },
  ];

  const EdgexColumns: BasicColumn[] = [
    { dataIndex: 'nodeId', title: '节点编号' },
    { dataIndex: 'model', title: '型号' },
    { dataIndex: 'v1', title: '值1' },
    {
      dataIndex: 'v2',
      title: '值2',
    },
    { dataIndex: 'bat', title: '电量(0-6)' },
    { dataIndex: 'uid', title: '上传网关' },
  ];

  const showTable = ref(true);
  const origin = ref('');
  const dataSource = ref<any[]>([]);
  const columns: Ref<BasicColumn[]> = ref([]);

  const [registerTable] = useTable({
    columns: columns,
    rowKey: 'id',
    showIndexColumn: false,
    dataSource: dataSource,
  });

  const [registerDrawer] = useDrawerInner(async (data) => {
    if (data.terminalType === 'MULTI_BUS') {
      origin.value = data.record.originData;
      columns.value = MultiBusColumns;
      const originData = data.record.originData;
      if (!/.*FFFFFFFFFF$/.test(originData)) {
        // lutil.alertError('无效数据');
        return;
      }

      let version = 0;
      const m = (originData.length - 25) % 10;
      if (m == 0) version = 1;
      if (m == 4) version = 2;

      if (version == 0) {
        // lutil.alertError('未知版本');
        return;
      }

      const tempData = originData.substring(m == 1 ? 15 : 19, originData.length - 10);
      for (let i = 0; i < tempData.length; i += 10) {
        const nodeData = tempData.substring(i, i + 10);
        const nodeNumber = nodeData.substring(8, 10);
        const high = nodeData.substring(0, 4);
        const low = nodeData.substring(4, 8);
        const electric = (
          ((parseInt(high, 16) - parseInt(low, 16)) * 32 * 5.1) /
          2048 /
          1.414
        ).toFixed(4);

        dataSource.value.push({
          nodeNumber: nodeNumber,
          nodeNumber10: parseInt(nodeNumber, 16),
          nodeData: nodeData,
          electric: electric,
        });
      }
    }
    if (data.terminalType === 'WN' || data.terminalType === 'EDGEX') {
      origin.value = data.record.nodes;
      columns.value = data.terminalType === 'WN' ? wnColums : EdgexColumns;
      dataSource.value = data.record.nodes.map((item) => ({
        ...item,
        uuid: data.record.uuid,
        ts: data.record.ts,
        value: JSON.stringify(item),
      }));
    }
    if (data.terminalType === 'AIR_BOX') {
      showTable.value = false;
      origin.value = JSON.stringify(data.record);
    }
  });
</script>
