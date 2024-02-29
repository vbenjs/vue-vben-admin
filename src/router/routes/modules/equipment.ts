import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const equipment: AppRouteModule = {
  path: '/equipment',
  name: 'Equipment',
  component: LAYOUT,
  redirect: '/equipment/index',
  meta: {
    orderNo: 20,
    title: '设备管理',
    icon: 'tabler:device-desktop',
    roles: ['Equipment'],
  },
  children: [
    {
      path: 'gateway',
      name: 'GatewayManager',
      component: () => import('@/views/equipment/gateway/GatewayManager.vue'),
      meta: {
        title: '网关管理',
        icon: 'ant-design:gateway-outlined',
        roles: ['GatewayManager'],
      },
    },
    {
      path: 'sensor',
      name: 'SensorManager',
      component: () => import('@/views/equipment/sensor/SensorManager.vue'),
      meta: {
        title: '传感器管理',
        icon: 'ic:outline-sensors',
        roles: ['SensorManager'],
      },
    },
    {
      path: 'custom',
      name: 'EquipmentCustom',
      component: () => import('@/views/equipment/custom/EquipmentCustom.vue'),
      meta: {
        title: '自定义设备',
        icon: 'tabler:device-desktop',
        roles: ['EquipmentManager'],
      },
    },
    {
      path: 'custom_sensor/:id',
      name: 'EquipmentSensor',
      component: () => import('@/views/equipment/custom/sensor/EquipmentSensor.vue'),
      meta: {
        title: '传感器',
        roles: ['EquipmentSensor'],
        hideMenu: true,
        hideBreadcrumb: true,
        currentActiveMenu: '/equipment/custom',
      },
    },
  ],
};

export default equipment;
