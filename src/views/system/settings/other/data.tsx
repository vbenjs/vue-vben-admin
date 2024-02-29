import { message } from 'ant-design-vue';
import { FormSchema } from '@/components/Form';
import { updateSystemConfig } from '@/api/system/systemConfig';
import { debounce } from 'lodash-es';
import { usePermission } from '@/hooks/web/usePermission';
import { miniProgramStateOptions } from '@/enums/miniProgramState';

export const keys = ['WX_DEFAULT_STORE', 'WX_MINIPROGRAM_STATE'];
const { hasPermission } = usePermission();
const isHadPermission = hasPermission('OtherConfig_update');

export function getFormSchema(): FormSchema[] {
  let WX_DEFAULT_STORE: string | undefined = undefined;
  return [
    {
      field: 'WX_DEFAULT_STORE',
      label: '默认地点',
      component: 'Input',
      helpMessage: '用户登录小程序是默认可以访问的地点。当该用户配置可访问地点时，此配置失效。',
      componentProps: {
        readonly: !isHadPermission,
        style: { width: '300px' },
        onChange: (e) => {
          WX_DEFAULT_STORE = e?.target?.value ?? e;
        },
        onBlur: () => {
          onSubmit(`${WX_DEFAULT_STORE}`, 'WX_DEFAULT_STORE');
        },
      },
      colProps: { span: 24 },
    },
    {
      field: 'WX_MINIPROGRAM_STATE',
      label: '小程序跳转类型',
      component: 'Select',
      componentProps: {
        readonly: !isHadPermission,
        style: { width: '300px' },
        options: miniProgramStateOptions,
        onSelect: debounce((value: string) => {
          onSubmit(`${value}`, 'WX_MINIPROGRAM_STATE');
        }, 300),
      },
      colProps: { span: 24 },
    },
  ];
}

const onSubmit = async (value: string, key: string) => {
  if (!isHadPermission) return;
  try {
    await updateSystemConfig({ [key]: value }, [key]);
    message.success('更新成功');
  } catch (error) {
    console.log(error);
  }
};
