import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:cog-outline', order: 900, title: '设置与安全' },
    name: 'SettingsRoot',
    path: '/settings',
    redirect: '/settings/chat',
    children: [
      {
        name: 'SettingsChat',
        path: '/settings/chat',
        component: () => import('#/views/factoryos/settings/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'SettingsCompany',
        path: '/settings/company',
        component: () => import('#/views/factoryos/settings/company/index.vue'),
        meta: { title: '公司切换' },
      },
      {
        name: 'SettingsRoles',
        path: '/settings/roles',
        component: () => import('#/views/factoryos/settings/roles/index.vue'),
        meta: { title: '权限与角色' },
      },
      {
        name: 'SettingsDatasources',
        path: '/settings/datasources',
        component: () => import('#/views/factoryos/settings/datasources/index.vue'),
        meta: { title: '数据源配置' },
      },
      {
        name: 'SettingsSecurity',
        path: '/settings/security',
        component: () => import('#/views/factoryos/settings/security/index.vue'),
        meta: { title: '安全与认证' },
      },
      {
        name: 'SettingsAudit',
        path: '/settings/audit',
        component: () => import('#/views/factoryos/settings/audit/index.vue'),
        meta: { title: '审计日志' },
      },
    ],
  },
];

export default routes;
