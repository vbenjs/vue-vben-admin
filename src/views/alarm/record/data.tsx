import { BasicColumn, FormProps } from '@/components/Table';
import { equipmentTypeMap, equipmentTypeOptions } from '@/enums/equipmentType';
import { alarmLevelColorMap, alarmLevelMap, alarmLevelOptions } from '@/enums/alarmLevel';
import { YNTag } from '@/components/Tag';
// import { getUserStoreByUser } from '@/api/userStore';
import { formatToDateTime } from '@/utils/dateUtil';
import { RemindRecordResult } from '@/api/remind/model/recordModel';
import { YN } from '@/enums/YN';
import { Tag } from 'ant-design-vue';
import { getStore } from '@/api/store';
import { useFormat } from '@/utils/format';
import { getRemindRecordById } from '@/api/remind/record';
import { BasicHelp } from '@/components/Basic';
import RemindAccount from '@/views/components/RemindAccount.vue';
import { useEnumStore } from '@/store/modules/enum';
import { StoreResult } from '@/api/model/storeModel';

const { formatStore, formatAttribute } = useFormat();

const enumStore = useEnumStore();

interface ColumnsOptions {
  isEquipment?: boolean;
}

export function getColumns(options?: ColumnsOptions): BasicColumn<RemindRecordResult>[] {
  const { isEquipment } = options || {};
  return [
    {
      dataIndex: 'remindMsg',
      title: '告警信息',
      width: 400,
      ellipsis: true,
      resizable: true,
      align: 'left',
    },
    {
      key: 'remindTime',
      dataIndex: 'remindTime',
      title: '告警时间',
      width: 180,
      customRender: ({ text }) => formatToDateTime(text),
      sorter: true,
    },
    {
      dataIndex: 'alarmLevel',
      title: '告警等级',
      width: 120,
      customRender: ({ text }) => (
        <Tag color={alarmLevelColorMap.get(text)}>{alarmLevelMap.get(text)}</Tag>
      ),
    },
    {
      dataIndex: 'remindAccount',
      title: '告警对象',
      width: 120,
      customRender: ({ text }) => <RemindAccount account={text} />,
    },
    {
      dataIndex: 'readTime',
      title: '已读',
      width: 80,
      customRender: ({ text }) => (
        <div>
          {text ? (
            <BasicHelp text={formatToDateTime(text)}>
              <YNTag text="Y" />
            </BasicHelp>
          ) : (
            <YNTag text="N" />
          )}
        </div>
      ),
    },
    {
      dataIndex: 'handleStatus',
      title: '处理状态',
      width: 80,
      customRender: ({ text, record }) => (
        <div>
          {record.reason ? (
            <BasicHelp text={record.reason}>
              <YNTag text={text} />
            </BasicHelp>
          ) : (
            <YNTag text={text} />
          )}
        </div>
      ),
    },
    {
      dataIndex: 'ignoreToday',
      title: '当日忽略',
      width: 80,
      customRender: ({ text }) => <YNTag text={text ? 'Y' : 'N'} />,
    },
    {
      dataIndex: 'count',
      title: '通知数量',
      width: 80,
      customRender: ({ record }) =>
        `${record.notificationCount ?? 0}/${record.notificationWait ?? 0}`,
    },
    {
      dataIndex: 'store',
      title: '地点',
      width: 250,
      customRender: ({ text }) => formatStore(text, '()'),
      ifShow: !isEquipment,
    },
    {
      dataIndex: 'timeRange',
      title: '监控时间',
      width: 220,
      customRender: ({ record }) => {
        return `在${record.timeRange}之${record.inRange === 'Y' ? '间' : '外'}`;
      },
    },
    {
      dataIndex: 'equipmentName',
      title: '设备名称',
      width: 250,
      ellipsis: true,
      resizable: true,
      ifShow: !isEquipment,
    },

    {
      dataIndex: 'equipmentType',
      title: '设备类型',
      width: 120,
      customRender: ({ text }) => equipmentTypeMap.get(text),
      ifShow: !isEquipment,
    },
    {
      dataIndex: 'attributeType',
      title: '属性',
      width: 140,
      customRender: ({ text }) => formatAttribute(text),
    },
  ];
}

export function getFormConfig(options?: ColumnsOptions): Partial<FormProps> {
  const { isEquipment } = options || {};
  return {
    autoSubmitOnEnter: true,
    rowProps: { gutter: 12 },
    labelWidth: 80,
    // showAdvancedButton: false,
    schemas: [
      {
        field: 'storeIds',
        label: '地点',
        component: 'ApiSelect',
        componentProps: () => {
          return {
            api: getStore,
            formatter: (item: StoreResult) => formatStore(item, '()'),
            showSearch: true,
            immediate: false,
            filterOption: false,
            labelField: 'name',
            valueField: 'id',
            searchField: 'storeInfo',
          };
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
        show: !isEquipment,
      },
      {
        label: '设备名称',
        field: 'equipmentName',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
        show: !isEquipment,
      },
      {
        label: '设备类型',
        field: 'equipmentType',
        component: 'Select',
        componentProps: {
          options: equipmentTypeOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
        show: !isEquipment,
      },
      {
        label: '告警等级',
        field: `alarmLevel`,
        component: 'Select',
        componentProps: {
          options: alarmLevelOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '告警属性',
        field: `attributeType`,
        component: 'Select',
        componentProps: {
          options: enumStore.getAttributeTypeOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '是否处理',
        field: `handleStatus`,
        component: 'Select',
        componentProps: {
          options: [
            { value: YN.Y, label: '是' },
            { value: YN.N, label: '否' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '告警时间',
        field: `remindTime`,
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '告警记录';
export const getItemApi = getRemindRecordById;
export type ItemResult = RemindRecordResult;
