import { FormProps, FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import { RemindTemplateResult } from '@/api/remind/model/template';
import {
  createRemindTemplate,
  enabledRemindTemplate,
  getRemindTemplateById,
  updateRemindTemplate,
} from '@/api/remind/template';
import { getAccount } from '@/api/system/account';
import { StatusSwitch } from '@/components/Business';

// title: string; // 模板名称
// maxRemindCount: number; // 最大告警次数，0为不限制
// remindInterval: number; // 告警间隔秒，最低60
// operatorId: number; // 通知运营
// remindManagerCount: number; // 达最大次数后通知管理，0为不通知
// managerIds: string; // 通知管理（多个）
// mark: string; // 备注
// sortNum: number; // 排序
// enabled: YN; // 启用Y/禁用N
export function getColumns(): BasicColumn<RemindTemplateResult>[] {
  return [
    {
      title: '模板名称',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '最大告警次数',
      dataIndex: 'maxRemindCount',
      width: 150,
    },
    {
      title: '告警间隔秒',
      dataIndex: 'remindInterval',
      width: 150,
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      width: 80,
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => enabledRemindTemplate([record.id], checked)}
            v-model:checked={record.enabled}
            auth="RemindTemplate_update"
          />
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'mark',
    },
    {
      title: '排序',
      dataIndex: 'sortNum',
      width: 80,
      sorter: true,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    rowProps: {
      gutter: 16,
    },
    // showAdvancedButton: false,
    schemas: [
      {
        label: '模板名称',
        field: `title`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: `enabled`,
        label: '启用',
        component: 'Select',
        componentProps: {
          options: [
            { label: '启用', value: 'Y' },
            { label: '禁用', value: 'N' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '通知模板';
export type ActionKey = 'create' | 'edit' | 'show' | 'copy';
export const createApi = createRemindTemplate;
export const updateApi = updateRemindTemplate;
export const getItemApi = getRemindTemplateById;
export type ItemResult = RemindTemplateResult;

const accountApi = async (where: Recordable) => {
  const data = await getAccount(where);
  return data.map((item) => {
    return {
      ...item,
      label: item.username + (item.name ? `(${item.name})` : ''),
    };
  });
};

export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {
  if (!actionKey) return [];
  return [
    {
      field: `title`,
      label: '模板名称',
      component: 'Input',
      required: actionKey !== 'show',
      componentProps: {
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      colProps: { span: 24 },
    },
    {
      field: `maxRemindCount`,
      label: '最大告警次数',
      required: actionKey !== 'show',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''};width: 100%`,
      },
      defaultValue: 0,
      colProps: { span: 24 },
    },
    {
      field: `remindInterval`,
      label: '告警间隔秒',
      required: actionKey !== 'show',
      component: 'InputNumber',
      componentProps: {
        min: 60,
        precision: 0,
        controls: false,
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''};width: 100%`,
      },
      defaultValue: 60,
      colProps: { span: 24 },
    },
    {
      field: `operatorId`,
      label: '通知运营',
      component: 'ApiSelect',
      componentProps: () => {
        return {
          api: accountApi,
          showSearch: true,
          filterOption: false,
          style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
          valueField: 'id',
          searchField: 'name',
        };
      },
      dynamicRules: () => {
        return [
          {
            required: actionKey !== 'show',
            trigger: 'blur',
            message: '请选择通知运营',
          },
        ];
      },
      colProps: { span: 24 },
    },
    {
      field: `remindManagerCount`,
      label: '几次后通知管理',
      helpMessage: ['0为不通知'],
      required: actionKey !== 'show',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''};width: 100%`,
      },
      defaultValue: 0,
      colProps: { span: 24 },
    },
    {
      field: `managerIds`,
      label: '通知管理',
      component: 'ApiSelect',
      componentProps: () => {
        return {
          api: accountApi,
          showSearch: true,
          filterOption: false,
          mode: 'multiple',
          style: `${actionKey === 'show' ? 'pointer-events:none' : ''};width: 100%`,

          valueField: 'id',
          searchField: 'name',
        };
      },
      colProps: { span: 24 },
    },
    {
      field: `mark`,
      label: '备注',
      component: 'InputTextArea',
      componentProps: {
        autoSize: { minRows: 4 },
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      colProps: { span: 24 },
    },
    {
      field: `sortNum`,
      label: '排序',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''};width: 100%`,
      },
      defaultValue: 0,
      colProps: { span: 24 },
    },
    {
      field: `enabled`,
      label: '启用',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '启用', value: 'Y' },
          { label: '禁用', value: 'N' },
        ],
        style: `${actionKey === 'show' ? 'pointer-events:none' : ''}`,
      },
      defaultValue: 'Y',
      colProps: { span: 24 },
    },
  ];
};
