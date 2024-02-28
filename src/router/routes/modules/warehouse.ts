import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const warehouse: AppRouteModule = {
  path: '/warehouse',
  name: 'Warehouse',
  component: LAYOUT,
  redirect: '/warehouse/box_code',
  meta: {
    orderNo: 10,
    icon: 'material-symbols:warehouse-outline-rounded',
    title: '仓库管理',
    roles: ['warehouse'],
  },
  children: [
    {
      path: 'box_code',
      name: 'BoxCode',
      component: () => import('@/views/warehouse/box/BoxCode.vue'),
      meta: {
        title: '盒码管理',
        icon: 'tabler:box',
        roles: ['packageManager'],
      },
      children: [
        {
          path: 'form',
          name: 'BoxCodeForm',
          component: () => import('@/views/warehouse/box/BoxCodeForm.vue'),
          meta: {
            title: '创建盒码',
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/warehouse/box_code',
          },
        },
        {
          path: 'bind',
          name: 'BoxCodeBind',
          component: () => import('@/views/warehouse/box/BoxCodeBind.vue'),
          meta: {
            title: '扫描生成',
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/warehouse/box_code',
          },
        },
      ],
    },
    //箱码管理
    {
      path: 'case_code',
      name: 'CaseCode',
      component: () => import('@/views/warehouse/case/CaseCode.vue'),
      meta: {
        title: '箱码管理',
        icon: 'material-symbols:box-outline',
        roles: ['boxManager'],
      },
      children: [
        {
          path: 'detail/:id',
          name: 'CaseCodeDetail',
          component: () => import('@/views/warehouse/case/CaseCodeDetail.vue'),
          meta: {
            title: '箱码详情',
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/warehouse/case_code',
          },
        },
      ],
    },
    //托码管理
    {
      path: 'pallet_code',
      name: 'PalletCode',
      component: () => import('@/views/warehouse/pallet/PalletCode.vue'),
      meta: {
        title: '托码管理',
        icon: 'ion:file-tray-full-outline',
        roles: ['palletManager'],
      },
      children: [
        {
          path: 'detail/:id',
          name: 'PalletCodeDetail',
          component: () => import('@/views/warehouse/pallet/PalletCodeDetail.vue'),
          meta: {
            title: '托码详情',
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/warehouse/pallet_code',
          },
        },
      ],
    },

    //入库管理
    {
      path: 'inbound',
      name: 'Inbound',
      component: () => import('@/views/warehouse/bill/Inbound.vue'),
      meta: {
        title: '入库管理',
        icon: 'ic:round-log-in',
        roles: ['inboundManager'],
      },
    },
    //出库管理
    {
      path: 'outbound',
      name: 'Outbound',
      component: () => import('@/views/warehouse/bill/Outbound.vue'),
      meta: {
        title: '出库管理',
        icon: 'ic:round-log-out',
        roles: ['outboundManager'],
      },
    },
    //
    {
      path: 'quality',
      name: 'Quality',
      component: () => import('@/views/warehouse/bill/Quality.vue'),
      meta: {
        title: '质量托单',
        icon: 'mi:document',
        roles: ['qualityBill'],
      },
    },

    //内部调整
    {
      path: 'other',
      name: 'other',
      component: () => import('@/views/warehouse/bill/other.vue'),
      meta: {
        title: '其他单据',
        icon: 'mdi:transfer',
        roles: ['otherBill'],
      },
    },
    //单据明细
    {
      path: 'billDetail/:id',
      name: 'BillDetail',
      component: () => import('@/views/warehouse/bill/BillDetail.vue'),
      meta: {
        title: '单据明细',
        icon: 'mdi:file-document-edit-outline',
        hideMenu: true,
        roles: ['inboundManager_detail', 'outboundManager_detail', 'otherBill_detail'],
      },
    },
    //查看明细
    {
      path: 'productDetail/:id',
      name: 'ProductDetail',
      component: () => import('@/views/warehouse/bill/ProductDetail.vue'),
      meta: {
        title: '查看明细',
        hideMenu: true,
        // hideTab: true,
        currentActiveMenu: '/warehouse',
      },
    },
  ],
};

export default warehouse;
