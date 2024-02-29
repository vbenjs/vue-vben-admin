<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="600"
    destroyOnClose
  >
    <DayPicker v-model="day" />
    <Divider />
    <template v-if="statis && statis.actualDataCount !== 0">
      <Descriptions class="px-4" :column="1">
        <Descriptions.Item label="接收数据量">
          {{ statis.actualDataCount }}
        </Descriptions.Item>
        <Descriptions.Item label="理论数据量">
          {{ statis.theoryDataCount }}
          <BasicHelp text="根据序号计算出的数据量（去除了序号重置的情况）">
            <Icon icon="ant-design:question-circle-outlined" class="ml-1" />
          </BasicHelp>
        </Descriptions.Item>
        <Descriptions.Item label="数据完整度">
          {{
            ((Number(statis.actualDataCount) * 100) / Number(statis.theoryDataCount)).toFixed(2) +
            '%'
          }}
        </Descriptions.Item>
        <template #title>
          <div>
            <span> 数据量（参考数据量480-1440） </span>
            <BasicHelp :text="['参考数据量，1-3分钟一条', ' 一天1440分钟 即480-1440条左右']">
              <Icon icon="ant-design:question-circle-outlined" class="ml-1" />
            </BasicHelp>
          </div>
        </template>
      </Descriptions>
      <template v-if="statis.loseList?.length">
        <Divider />
        <BasicTable @register="registerTable" class="!p-0" :dataSource="statis.loseList ?? []" />
      </template>
    </template>
    <template v-else>
      <Empty />
    </template>
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { ref, watch } from 'vue';
  import { DayPicker } from '@/components/DatePicker';
  import { getGatewayStatis } from '@/api/gateway';
  import { Descriptions, Divider, Empty } from 'ant-design-vue';
  import { BasicHelp } from '@/components/Basic';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { formatToDateTime } from '@/utils/dateUtil';

  const rowId = ref<number>();
  const title = ref('');
  const day = ref();
  const statis = ref();

  defineEmits(['load', 'register']);
  const [registerTable] = useTable({
    columns: [
      {
        dataIndex: ['fromData', 'receiveTime'],
        title: '开始时间',
        width: 180,
        customRender: ({ text }) => formatToDateTime(text),
      },
      {
        key: 'startNumber',
        title: '开始序号',
        width: 110,
        customRender: function ({ record }) {
          var originData = record.fromData.originData;
          if (!/.*FFFFFFFFFF$/.test(originData)) return '';
          var m = (originData.length - 25) % 10;
          if (m == 4) {
            var sNumber = originData.substring(15, 19);
            return sNumber + '(' + parseInt(sNumber, 16) + ')';
          }

          return '';
        },
      },
      {
        dataIndex: ['toData', 'receiveTime'],
        title: '结束时间',
        width: 180,
        customRender: ({ text }) => formatToDateTime(text),
      },
      {
        key: 'endNumber',
        title: '结束序号',
        width: 110,
        customRender: function ({ record }) {
          var originData = record.toData.originData;
          if (!/.*FFFFFFFFFF$/.test(originData)) return '';
          var m = (originData.length - 25) % 10;
          if (m == 4) {
            var sNumber = originData.substring(15, 19);
            return sNumber + '(' + parseInt(sNumber, 16) + ')';
          }

          return '';
        },
      },
      {
        dataIndex: 'serialNumber',
        title: '异常说明',
        customRender: function ({ record }) {
          switch (record.type) {
            case 'LOSE':
              return (
                '数据序号丢失（' +
                (parseInt(record.toData.originData.substring(15, 19), 16) -
                  parseInt(record.fromData.originData.substring(15, 19), 16) -
                  1) +
                '条）'
              );
            case 'REPEAT':
              return '数据序号重复';
            case 'RESET':
              return '数据序号重置';
          }
          return '';
        },
      },
    ],
    rowKey: 'id',
    showIndexColumn: false,
    pagination: { hideOnSinglePage: true },
  });

  const [registerDrawer, { setDrawerProps, changeLoading }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    rowId.value = data.id;
    title.value = data.title;
  });

  const update = async (id: number, day: string) => {
    try {
      changeLoading(true);

      statis.value = await getGatewayStatis({
        id: id,
        createTime: day,
      });
      changeLoading(false);
    } catch (error) {
      changeLoading(false);
    }
  };

  watch([() => rowId.value, () => day.value], ([id, day]) => {
    if (!id) return;
    if (!day) return;
    update(id, day + ' - ' + day);
  });
</script>
