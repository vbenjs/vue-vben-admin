import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const alarm: AppRouteModule = {
  path: '/alarm',
  name: 'Alarm',
  component: LAYOUT,
  redirect: '/alarm/setting',
  meta: {
    orderNo: 70,
    title: '告警管理',
    icon: 'icon-park-outline:alarm',
    roles: ['AlarmManager'],
  },
  children: [
    {
      path: 'setting',
      name: 'AlarmSetting',
      component: () => import('@/views/alarm/setting/AlarmSetting.vue'),
      meta: {
        title: '告警配置',
        icon: 'icon-park-outline:alarm',
        roles: ['AlarmSetting'],
      },
    },
    {
      path: 'record',
      name: 'AlarmRecord',
      component: () => import('@/views/alarm/record/AlarmRecord.vue'),
      meta: {
        title: '告警记录',
        icon: 'icon-park-outline:log',
        roles: ['AlarmRecord'],
      },
    },
    {
      path: 'equipment/:id',
      name: 'AlarmEquipment',
      component: () => import('@/views/alarm/equipment/AlarmEquipment.vue'),
      meta: {
        title: '告警设备',
        icon: 'icon-park-outline:log',
        roles: ['CustomAlarm', 'SensorAlarm', 'GatewayAlarm'],
        hideMenu: true,
        hideBreadcrumb: true,
        currentActiveMenu: '/alarm/setting',
      },
    },
  ],
};

export default alarm;
