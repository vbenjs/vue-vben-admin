import { Tag } from 'ant-design-vue';
import { YNTag } from '@/components/Tag';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { ref } from 'vue';

import { getGateway } from '@/api/gateway';
import { getEquipment, getEquipmentAttributes } from '@/api/equipment';
import { getRemindTemplate } from '@/api/remind/template';
import { getSensor } from '@/api/sensor';
import { getBusinessTime } from '@/api/businessTime';
import { getRemindMessage } from '@/api/remind/message';
import { RemindConfigResult } from '@/api/remind/model/config';
import { getStore } from '@/api/store';
// import { getUserStore } from '@/api/userStore';
import {
  SupportAttr,
  createRemindConfig,
  enabledRemindConfig,
  getRemindConfigById,
  getSupportAttr,
  updateRemindConfig,
} from '@/api/remind/config';
import { YN } from '@/enums/YN';

import { EquipmentType, equipmentTypeMap, equipmentTypeOptions } from '@/enums/equipmentType';
import { alarmLevelColorMap, alarmLevelMap, alarmLevelOptions } from '@/enums/alarmLevel';
import { isString } from '@/utils/is';
import { useFormat } from '@/utils/format';
import { RemindMessageResult } from '@/api/remind/model/message';
import { RemindTemplateResult } from '@/api/remind/model/template';
import { useEnumStore } from '@/store/modules/enum';
import { StatusSwitch } from '@/components/Business';

const { formatStore, formatSensor, formatAttribute, formatRemindMessage, formatGateway } =
  useFormat();
const enumStore = useEnumStore();

interface ColumnsOptions {
  isEquipment?: boolean;
  permissionCode: string | string[];
}

export function getColumns(options: ColumnsOptions): BasicColumn<RemindConfigResult>[] {
  const { isEquipment, permissionCode } = options;
  const codes = isString(permissionCode) ? [permissionCode] : permissionCode;

  return [
    {
      dataIndex: 'equipmentName',
      title: '设备名称',
      width: 250,
      ellipsis: false,
      resizable: true,
      fixed: 'left',
      ifShow: !isEquipment,
    },
    {
      dataIndex: 'store',
      title: '地点',
      width: 250,
      customRender: ({ text }) => formatStore(text),
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
    {
      dataIndex: 'alarmLevel',
      title: '告警等级',
      width: 120,
      customRender: ({ text }) => (
        <Tag color={alarmLevelColorMap.get(text)}>{alarmLevelMap.get(text)}</Tag>
      ),
    },
    {
      title: '启用',
      dataIndex: 'status',
      width: 80,
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => enabledRemindConfig([record.id], checked)}
            v-model:checked={record.status}
            auth={codes}
          />
        );
      },
    },
    {
      title: '是否有效',
      dataIndex: 'valid',
      width: 100,
      customRender: ({ text }) => <YNTag text={text} />,
    },
    {
      dataIndex: 'messages',
      title: '通知方式',
      width: 180,
      customRender: ({ text }) => text?.map(formatRemindMessage).join('、'),
    },
    {
      dataIndex: 'template',
      title: '告警模板',
      width: 140,
      customRender: ({ text }) => text?.title,
    },
    {
      dataIndex: 'timeRange',
      title: '监控时间',
      width: 220,
      customRender: ({ record }) => {
        return `在${record.timeRange}之${record.inRange === 'Y' ? '间' : '外'}`;
      },
    },
    { dataIndex: 'mark', title: '备注', width: 150 },
    // {
    //   dataIndex: 'createTime',
    //   title: '创建时间',
    //   width: 160,
    //   customRender: ({ text }) => formatToDate(text),
    // },
  ];
}

export function getFormConfig(options?: Partial<ColumnsOptions>): Partial<FormProps> {
  const { isEquipment } = options || {};
  return {
    autoSubmitOnEnter: true,
    rowProps: { gutter: 12 },
    labelWidth: 80,
    // showAdvancedButton: false,
    schemas: [
      {
        field: 'storeId',
        label: '地点',
        component: 'ApiSelect',
        componentProps: () => ({
          api: getStore,
          formatter: (item: any) => formatStore(item, '()'),
          immediate: false,
          showSearch: true,
          filterOption: false,
          labelField: 'name',
          valueField: 'id',
          searchField: 'storeInfo',
        }),
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
        label: '通知方式',
        field: 'messageId',
        component: 'ApiSelect',
        componentProps: () => ({
          placeholder: '请选择通知方式',
          api: getRemindMessage,
          formatter: formatRemindMessage,
          immediate: false,
          showSearch: true,
          filterOption: false,
          valueField: 'id',
          searchField: 'title',
        }),
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '告警模板',
        field: 'templateId',
        component: 'ApiSelect',
        componentProps: () => ({
          placeholder: '请选择告警模板',
          api: getRemindTemplate,
          immediate: false,
          showSearch: true,
          filterOption: false,
          labelField: 'title',
          valueField: 'id',
          searchField: 'title',
        }),
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '启用',
        field: `status`,
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
        label: '有效',
        field: `valid`,
        component: 'Select',
        componentProps: {
          options: [
            { value: YN.Y, label: '是' },
            { value: YN.N, label: '否' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '告警';
export type ActionKey = 'create' | 'edit' | 'show' | 'copy';
export const createApi = createRemindConfig;
export const updateApi = updateRemindConfig;
export const getItemApi = getRemindConfigById;
export type ItemResult = RemindConfigResult;

export interface FormSchemaOptions {
  actionKey?: ActionKey;
  equipmentType?: EquipmentType;
  equipmentId?: number | string;
  checkedMessages?: RemindMessageResult[];
  checkedTemplate?: RemindTemplateResult[];
  checkedEquipment?: any[];
}
export const getFormSchema: (options?: FormSchemaOptions) => FormSchema[] = (options) => {
  const {
    actionKey,
    equipmentType,
    equipmentId,
    checkedMessages,
    checkedTemplate,
    checkedEquipment,
  } = options || {};

  if (!actionKey) return [];

  const supportAttr = ref<SupportAttr[]>([]);

  const isRequired = actionKey !== 'show' && !equipmentType;
  return [
    {
      label: '设备类型',
      field: 'equipmentType',
      component: 'Select',
      componentProps: ({ formModel }) => ({
        placeholder: '请选择设备类型',
        options: equipmentTypeOptions,
        onChange: () => {
          formModel.equipmentId = undefined;
          formModel.attributeType = undefined;
        },
        style: `${!isRequired ? 'pointer-events:none' : ''}`,
        showArrow: isRequired,
      }),
      rules: [{ required: isRequired, message: '请选择设备类型' }],
      colProps: { span: 24 },
      defaultValue: equipmentType ?? 'GATEWAY',
    },
    {
      label: '选择网关',
      field: 'equipmentId',
      component: 'ApiSelect',
      componentProps: ({ formModel }) => ({
        placeholder: '请选择网关',
        api: getGateway,
        formatter: formatGateway,
        checkedOptions: checkedEquipment,
        immediate: false,
        showSearch: true,
        filterOption: false,
        labelField: 'name',
        valueField: 'id',
        searchField: 'terminalNum',
        style: `${!isRequired ? 'pointer-events:none' : ''}`,
        showArrow: isRequired,
        onChange: () => {
          formModel.attributeType = undefined;
          formModel.attributes = undefined;
        },
      }),
      dynamicRules: () => {
        return [{ required: isRequired, message: '请选择网关', trigger: 'blur' }];
      },
      colProps: { span: 24 },
      ifShow: ({ model }) => model.equipmentType === 'GATEWAY',
      defaultValue: equipmentId,
    },
    {
      label: '选择传感器',
      field: 'equipmentId',
      component: 'ApiSelect',
      componentProps: ({ formModel }) => ({
        placeholder: '请选择传感器',
        api: getSensor,
        formatter: formatSensor,
        checkedOptions: checkedEquipment,
        immediate: false,
        showSearch: true,
        filterOption: false,
        valueField: 'id',
        searchField: 'terminalNum',
        style: `${!isRequired ? 'pointer-events:none' : ''}`,
        showArrow: isRequired,
        onChange: () => {
          formModel.attributeType = undefined;
          formModel.attributes = undefined;
        },
      }),
      dynamicRules: () => {
        return [{ required: isRequired, message: '请选择传感器', trigger: 'blur' }];
      },
      colProps: { span: 24 },
      ifShow: ({ model }) => model.equipmentType === 'SENSOR',
      defaultValue: equipmentId,
    },
    {
      label: '选择设备',
      field: 'equipmentId',
      component: 'ApiSelect',
      componentProps: ({ formModel }) => ({
        placeholder: '请选择设备',
        api: getEquipment,
        checkedOptions: checkedEquipment,
        immediate: false,
        showSearch: true,
        filterOption: false,
        labelField: 'equipmentName',
        valueField: 'id',
        searchField: 'equipmentName',
        style: `${!isRequired ? 'pointer-events:none' : ''}`,
        showArrow: isRequired,
        onChange: () => {
          formModel.attributeType = undefined;
          formModel.attributes = undefined;
        },
      }),
      dynamicRules: () => {
        return [{ required: isRequired, message: '请选择设备', trigger: 'blur' }];
      },
      colProps: { span: 24 },
      ifShow: ({ model }) => model.equipmentType === 'CUSTOM',
      defaultValue: equipmentId,
    },
    {
      label: '通知方式',
      field: 'messages',
      component: 'ApiSelect',
      componentProps: () => ({
        placeholder: '请选择通知方式',
        api: getRemindMessage,
        formatter: formatRemindMessage,
        checkedOptions: checkedMessages,
        immediate: false,
        showSearch: true,
        filterOption: false,
        mode: 'multiple',
        valueField: 'id',
        searchField: 'title',
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      }),
      dynamicRules: () => {
        return [
          {
            required: actionKey !== 'show',
            message: '请选择通知方式',
            trigger: 'blur',
          },
        ];
      },
      colProps: { span: 24 },
    },
    {
      label: '告警模板',
      field: 'templateId',
      component: 'ApiSelect',
      componentProps: () => ({
        placeholder: '请选择告警模板',
        api: getRemindTemplate,
        checkedOptions: checkedTemplate,
        immediate: false,
        showSearch: true,
        filterOption: false,
        labelField: 'title',
        valueField: 'id',
        searchField: 'title',
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      }),
      dynamicRules: () => {
        return [
          {
            required: actionKey !== 'show',
            message: '请选择告警模板',
            trigger: 'blur',
          },
        ];
      },
      colProps: { span: 24 },
    },
    {
      label: '告警属性',
      field: 'attributeType',
      component: 'ApiSelect',
      componentProps: ({ formModel }) => ({
        placeholder: '请选择告警属性',
        api: async (where: any) => {
          const { equipmentId, equipmentType } = where;
          if (!equipmentId) return;
          const data = await getSupportAttr(equipmentType, equipmentId);
          supportAttr.value = data;
          return data;
        },
        params: {
          equipmentType: formModel.equipmentType,
          equipmentId: formModel.equipmentId,
        },
        labelField: 'name',
        valueField: 'code',
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      }),
      dynamicRules: () => {
        return [
          {
            required: actionKey !== 'show',
            message: '请选择告警属性',
            trigger: 'blur',
          },
        ];
      },
      colProps: { span: 24 },
    },
    {
      label: '设备属性',
      field: 'attributes',
      component: 'ApiSelect',
      componentProps: ({ formModel }) => ({
        placeholder: '请选择设备属性',
        api: async () => {
          if (!formModel.equipmentId) return [];
          const data = await getEquipmentAttributes(formModel.equipmentId);
          return data
            .filter((item) => item.attributeType === formModel.attributeType)
            .map((item) => ({
              ...item,
              name: formatAttribute(item.attributeType, item.sensor),
            }));
        },
        params: {
          attributeType: formModel.attributeType,
        },
        labelField: 'name',
        valueField: 'id',
        mode: 'multiple',
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      }),
      dynamicRules: () => {
        return [
          {
            required: actionKey !== 'show',
            message: '请选择设备属性',
            trigger: 'blur',
          },
        ];
      },
      colProps: { span: 24 },
      ifShow: ({ model }) => model.equipmentType === 'CUSTOM',
    },
    {
      label: '时间范围',
      field: 'timeRange',
      component: 'ApiSelect',
      componentProps: () => ({
        placeholder: '请选择时间范围',
        api: async () => {
          const data = await getBusinessTime();
          return data.map((item) => ({
            value: `${item.startTime}-${item.endTime}`,
            label: `${item.startTime}-${item.endTime}`,
          }));
        },
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      }),
      dynamicRules: () => {
        return [
          {
            required: actionKey !== 'show',
            message: '请选择时间范围',
            trigger: 'blur',
          },
        ];
      },
      colProps: { span: 20 },
    },
    {
      label: '',
      field: 'inRange',
      component: 'Select',
      labelWidth: 157,
      required: actionKey !== 'show',
      componentProps: {
        options: [
          { value: YN.Y, label: '内' },
          { value: YN.N, label: '外' },
        ],
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      defaultValue: YN.Y,
      colProps: { span: 4 },
    },
    {
      label: '告警等级',
      field: 'alarmLevel',
      component: 'Select',
      required: actionKey !== 'show',
      componentProps: {
        options: alarmLevelOptions,
        placeholder: '请选择告警等级',
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      colProps: { span: 24 },
    },
    {
      label: '统计方式',
      field: 'statType',
      component: 'RadioGroup',
      required: actionKey !== 'show',
      componentProps: {
        placeholder: '请选择统计方式',
        options: enumStore.statTypeOptions,
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      defaultValue: 'SUM',
      colProps: { span: 12 },
    },
    {
      label: '条件类型',
      field: 'conditionType',
      component: 'RadioGroup',
      required: actionKey !== 'show',
      componentProps: {
        placeholder: '请选择条件类型',
        options: enumStore.conditionTypeOptions,
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      defaultValue: 'LT',
      colProps: { span: 12 },
    },
    {
      label: '条件阈值',
      field: 'conditionValue',
      component: 'Input',
      componentProps: ({ formModel }) => ({
        placeholder: '请输入条件阈值',
        style: `width:100%;${actionKey === 'show' ? 'pointer-events:none' : ''}`,
        controls: false,
        suffix: supportAttr.value.find((item) => item.code === formModel.attributeType)?.unit ?? '',
        type: 'number',
        allowClear: false,
      }),
      rules: [{ required: actionKey !== 'show', message: '请输入条件阈值' }],
      helpMessage: ({ model }) =>
        supportAttr.value.find((item) => item.code === model.attributeType)?.mark ?? '',
      colProps: { span: 24 },
    },

    {
      field: `status`,
      label: '是否启用',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { value: YN.Y, label: '启用' },
          { value: YN.N, label: '禁用' },
        ],
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      defaultValue: 'Y',
      colProps: { span: 24 },
    },

    {
      label: '备注',
      field: 'mark',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 4 },
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      colProps: { span: 24 },
    },
  ];
};
