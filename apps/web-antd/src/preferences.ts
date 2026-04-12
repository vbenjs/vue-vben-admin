import {
  defineOverridesPreferences,
  definePreferencesExtension,
} from '@vben/preferences';

interface WebAntdPreferencesExtension {
  defaultTableSize: number;
  enableFormFullscreen: boolean;
  reportTitle: string;
  tenantMode: 'multi' | 'single';
}

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
  },
});

export const preferencesExtension =
  definePreferencesExtension<WebAntdPreferencesExtension>({
    tabLabel: 'Antd 扩展',
    title: '业务偏好',
    fields: [
      {
        component: 'switch',
        defaultValue: true,
        key: 'enableFormFullscreen',
        label: '启用表单全屏模式',
        tip: '子项目可在自己的业务场景中读取这个扩展配置。',
      },
      {
        component: 'select',
        defaultValue: 'single',
        key: 'tenantMode',
        label: '租户模式',
        options: [
          { label: '单租户', value: 'single' },
          { label: '多租户', value: 'multi' },
        ],
      },
      {
        component: 'number',
        componentProps: {
          max: 200,
          min: 10,
          step: 10,
        },
        defaultValue: 20,
        key: 'defaultTableSize',
        label: '默认分页条数',
      },
      {
        component: 'input',
        defaultValue: '欢迎使用 Web Antd',
        key: 'reportTitle',
        label: '报表默认标题',
        placeholder: '请输入报表默认标题',
      },
    ],
  });
