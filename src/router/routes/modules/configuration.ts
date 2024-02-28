import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const configuration: AppRouteModule = {
  path: '/configuration',
  name: 'Configuration',
  component: LAYOUT,
  redirect: '/configuration/base_data',
  meta: {
    orderNo: 90,
    icon: 'ep:set-up',
    title: '配置管理',
    roles: ['configuration'],
  },
  children: [
    //基础数据
    {
      path: 'base_data',
      name: 'BaseData',
      component: () => import('@/views/configuration/base/BaseData.vue'),
      meta: {
        title: '基础数据',
        icon: 'gg:database',
        roles: ['baseData'],
      },
      children: [
        {
          path: 'manager/:type',
          name: 'BaseDataManager',
          component: () => import('@/views/configuration/base/Popup/DataManager.vue'),
          meta: {
            title: '数据管理',
            // roles: ['baseData_manager'],
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/configuration/base_data',
          },
        },
      ],
    },
    {
      path: 'print_template',
      name: 'PrintTemplate',
      component: () => import('@/views/configuration/template/PrintTemplate.vue'),
      meta: {
        title: '打印模板',
        icon: 'material-symbols-light:photo-prints-outline',
        roles: ['printTemplate'],
      },
      children: [
        {
          path: 'update/:id',
          name: 'UpdatePrintTemplate',
          component: () => import('@/views/configuration/template/Design/DesignDrawer.vue'),
          meta: {
            title: '更新打印模板 ',
            roles: ['printTemplate_updateContent'],
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/configuration/print_template',
          },
        },
      ],
    },
    {
      path: 'Printer',
      name: 'Printer',
      component: () => import('@/views/configuration/printer/Printer.vue'),
      meta: {
        title: '打印机管理',
        icon: 'carbon:printer',
        roles: ['printer'],
      },
    },
    {
      path: 'barcode',
      name: 'Barcode',
      component: () => import('@/views/configuration/barcodeRule/BarcodeRule.vue'),
      meta: {
        title: '条码规则',
        icon: 'carbon:barcode',
        roles: ['barcodeRule'],
      },
      children: [
        {
          path: 'update/:id',
          name: 'UpdateBarcodeRule',
          component: () => import('@/views/configuration/barcodeRule/Popup/UpdateBarcodeRule.vue'),
          meta: {
            title: '更新条码规则',
            roles: ['barcodeRule_updateContent'],
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/configuration/barcode',
          },
        },
        {
          path: 'update_verify/:id',
          name: 'UpdateVerifyRule',
          component: () => import('@/views/configuration/barcodeRule/Popup/UpdateVerifyRule.vue'),
          meta: {
            title: '更新校验规则',
            roles: ['barcodeRule_updateVerify'],
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/configuration/barcode',
          },
        },
      ],
    },
    {
      path: 'pda',
      name: 'PDA',
      component: () => import('@/views/configuration/pda/PDA.vue'),
      meta: {
        title: 'PDA管理',
        icon: 'fluent:phone-24-regular',
        roles: ['pda'],
      },
      children: [
        {
          path: 'update_boxRule/:id',
          name: 'UpdateBoxRule',
          component: () => import('@/views/configuration/pda/UpdateBoxRule.vue'),
          meta: {
            title: '更新箱码校验规则',
            roles: ['pda_boxRule'],
            hideMenu: true,
            currentActiveMenu: '/configuration/pda',
          },
        },
        {
          path: 'update_billInRule/:id',
          name: 'UpdateBillInRule',
          component: () => import('@/views/configuration/pda/UpdateBillInRule.vue'),
          meta: {
            title: '更新入库校验规则',
            roles: ['pda_billInRule'],
            hideMenu: true,
            currentActiveMenu: '/configuration/pda',
          },
        },
      ],
    },
    {
      path: 'print_rules',
      name: 'PrintRules',
      component: () => import('@/views/configuration/PrintRules/PrintRules.vue'),
      meta: {
        title: '打印规则',
        icon: 'tabler:file-settings',
        roles: ['printRule'],
      },
    },
    //客户管理
    {
      path: 'customer',
      name: 'Customer',
      component: () => import('@/views/configuration/customer/Customer.vue'),
      meta: {
        title: '客户管理',
        icon: 'carbon:user-role',
        roles: ['customer'],
      },
      children: [
        {
          path: 'relation/:id',
          name: 'RelationManager',
          component: () => import('@/views/configuration/customer/Popup/RelationManager.vue'),
          meta: {
            title: '关联数据',
            roles: ['customer_relation'],
            hideMenu: true,
            // hideTab: true,
            currentActiveMenu: '/configuration/customer',
          },
        },
      ],
    },
  ],
};

export default configuration;
