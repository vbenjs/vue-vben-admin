import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const monitor: AppRouteModule = {
  path: '/monitor',
  name: 'Monitor',
  component: LAYOUT,
  redirect: '/monitor/index',
  meta: {
    orderNo: 50,
    title: '监测管理',
    icon: '',
    roles: ['Monitor'],
  },
  children: [
    {
      path: 'gateway',
      name: 'GatewayManager',
      component: () => import('@/views/monitor/gateway/GatewayManager.vue'),
      meta: {
        title: '网关管理',
        icon: 'ant-design:gateway-outlined',
        roles: ['GatewayManager'],
      },
    },
    {
      path: 'sensor',
      name: 'SensorManager',
      component: () => import('@/views/monitor/sensor/SensorManager.vue'),
      meta: {
        title: '传感器管理',
        icon: 'ic:outline-sensors',
        roles: ['SensorManager'],
      },
    },
    {
      path: 'custom',
      name: 'EquipmentCustom',
      component: () => import('@/views/monitor/custom/EquipmentCustom.vue'),
      meta: {
        title: '自定义设备',
        icon: 'tabler:device-desktop',
        roles: ['EquipmentManager'],
      },
    },
    {
      path: 'custom_sensor/:id',
      name: 'EquipmentSensor',
      component: () => import('@/views/monitor/custom/sensor/EquipmentSensor.vue'),
      meta: {
        title: '传感器',
        roles: ['EquipmentSensor'],
        hideMenu: true,
        hideBreadcrumb: true,
        currentActiveMenu: '/monitor/custom',
      },
    },
    {
      path: 'alarm/setting',
      name: 'AlarmSetting',
      component: () => import('@/views/monitor/alarm/setting/AlarmSetting.vue'),
      meta: {
        title: '告警配置',
        icon: 'icon-park-outline:alarm',
        roles: ['AlarmSetting'],
      },
    },
    {
      path: 'alarm/record',
      name: 'AlarmRecord',
      component: () => import('@/views/monitor/alarm/record/AlarmRecord.vue'),
      meta: {
        title: '告警记录',
        icon: 'icon-park-outline:log',
        roles: ['AlarmRecord'],
      },
    },
    {
      path: 'alarm/equipment/:id',
      name: 'AlarmEquipment',
      component: () => import('@/views/monitor/alarm/equipment/AlarmEquipment.vue'),
      meta: {
        title: '告警设备',
        icon: 'icon-park-outline:log',
        roles: ['CustomAlarm', 'SensorAlarm', 'GatewayAlarm'],
        hideMenu: true,
        hideBreadcrumb: true,
        currentActiveMenu: '/monitor',
      },
    },
  ],
};

export default monitor;
