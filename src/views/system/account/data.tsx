import { Tag } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';
import { getRole } from '@/api/system/roles';
import { BasicColumn, FormProps } from '@/components/Table';
import { YNTag } from '@/components/Tag';
import { formatToDateTime } from '@/utils/dateUtil';
import { YN } from '@/enums/YN';
import { intToIp } from '@/utils';
import { StatusSwitch } from '@/components/Business';
import { modifyStatus } from '@/api/system/account';

const { t } = useI18n();

export function getColumn(): BasicColumn[] {
  return [
    {
      title: t('system.account.username'),
      dataIndex: 'username',
      width: 150,
      fixed: 'left',
    },
    {
      title: t('system.role.role'),
      dataIndex: 'roles',
      customRender: ({ text }) => {
        return (
          <div>
            {text.map((item) => (
              <Tag color="blue">{item.name} </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: t('system.account.email'),
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
    },
    { title: t('common.noteText'), dataIndex: 'note' },
    {
      title: t('system.account.lastLoginTime'),
      dataIndex: 'lastLoginTime',
      customRender: ({ text }) => formatToDateTime(text),
    },
    {
      title: t('system.account.sysDefault'),
      dataIndex: 'sysDefault',
      width: 120,
      customRender: ({ text }) => <YNTag text={text} />,
    },
    {
      title: t('common.enableText'),
      dataIndex: 'enabled',
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => modifyStatus(record.id, checked)}
            v-model:checked={record.enabled}
            checked-children="启用"
            un-checked-children="禁用"
            disabled={record.sysDefault === 'Y'}
          />
        );
      },
    },
    { title: t('system.account.loginTimes'), dataIndex: 'loginTimes' },
    {
      title: t('system.account.lastLoginIp'),
      dataIndex: 'lastLoginIp',
      customRender: ({ text }) => intToIp(text),
    },
    { title: t('common.form.createdBy'), dataIndex: 'createdBy', width: 100 },
    {
      title: t('common.form.createdTime'),
      dataIndex: 'createdTime',
      customRender: ({ text }) => formatToDateTime(text),
    },
    { title: t('common.form.updatedBy'), dataIndex: 'updatedBy', width: 100 },
    {
      title: t('common.form.updatedTime'),
      dataIndex: 'updatedTime',
      customRender: ({ text }) => formatToDateTime(text),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 120,
    autoSubmitOnEnter: true,
    schemas: [
      {
        field: `username`,
        label: t('system.account.username'),
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'roleId',
        label: t('system.role.role'),
        component: 'ApiSelect',
        componentProps: () => {
          return {
            api: getRole,
            showSearch: true,
            filterOption: false,
            mode: 'multiple',
            maxTagCount: 2,
            labelField: 'name',
            valueField: 'id',
            searchField: 'name',
          };
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: `enabled`,
        label: t('common.enableText'),
        component: 'Select',
        componentProps: {
          options: [
            { value: YN.Y, label: '启用' },
            { value: YN.N, label: '禁用' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'lastLoginTime',
        label: '最后登录时间',
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
