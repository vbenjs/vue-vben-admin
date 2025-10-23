export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
  homePath?: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'Vben',
    roles: ['super'],
    username: 'vben',
  },
  {
    id: 1,
    password: '123456',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
    homePath: '/workspace',
  },
  {
    id: 2,
    password: '123456',
    realName: 'Jack',
    roles: ['user'],
    username: 'jack',
    homePath: '/analytics',
  },
];

export const MOCK_CODES = [
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'vben',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
];

const factoryMenus = [
  {
    meta: { icon: 'mdi:clipboard-list-outline', order: 100, title: 'FactoryOS' },
    name: 'FactoryOS',
    path: '/factoryos',
    redirect: '/factoryos/menu',
    children: [
      // 菜单导航页已移除
      {
        meta: { icon: 'mdi:clipboard-text-outline', title: '项目管理' },
        name: 'Projects',
        path: '/projects',
        redirect: '/projects/chat',
        children: [
          {
            name: 'ProjectsChatMenu',
            path: '/projects/chat',
            component: '/factoryos/projects/chat/index',
            meta: { title: '对话' },
          },
          { name: 'ProjectsListMenu', path: '/projects/list', component: '/factoryos/projects/list/index', meta: { title: '项目列表' } },
          { name: 'ProjectsGanttMenu', path: '/projects/gantt', component: '/factoryos/projects/gantt/index', meta: { title: '甘特图' } },
          { name: 'ProjectsBoardMenu', path: '/projects/board', component: '/factoryos/projects/board/index', meta: { title: '看板' } },
          { name: 'ProjectsCostMenu', path: '/projects/cost', component: '/factoryos/projects/cost/index', meta: { title: '成本分析' } },
          { name: 'ProjectsWeeklyMenu', path: '/projects/weekly', component: '/factoryos/projects/weekly/index', meta: { title: '周交付' } },
          { name: 'ProjectsReportsMenu', path: '/projects/reports', component: '/factoryos/projects/reports/index', meta: { title: '报表与仪表盘' } },
          { name: 'ProjectsTemplatesMenu', path: '/projects/templates', component: '/factoryos/projects/templates/index', meta: { title: '模板中心' } },
        ],
      },
      {
        meta: { icon: 'mdi:currency-cny', title: '财务管理' },
        name: 'Finance',
        path: '/finance',
        redirect: '/finance/chat',
        children: [
          { name: 'FinanceChatMenu', path: '/finance/chat', component: '/factoryos/finance/chat/index', meta: { title: '对话' } },
          { name: 'FinanceReportsMenu', path: '/finance/reports', component: '/factoryos/finance/reports/index', meta: { title: '报表（日/周/月）' } },
          { name: 'FinanceAlertsMenu', path: '/finance/alerts', component: '/factoryos/finance/alerts/index', meta: { title: '指标预警' } },
          { name: 'FinanceProcCompareMenu', path: '/finance/procurement-compare', component: '/factoryos/finance/procurement-compare/index', meta: { title: '历史采购对比' } },
          { name: 'FinanceDashboardMenu', path: '/finance/dashboard', component: '/factoryos/finance/dashboard/index', meta: { title: '财务仪表盘' } },
        ],
      },
      {
        meta: { icon: 'mdi:check-decagram-outline', title: '审批管理' },
        name: 'Approvals',
        path: '/approvals',
        redirect: '/approvals/chat',
        children: [
          { name: 'ApprovalsChatMenu', path: '/approvals/chat', component: '/factoryos/approvals/chat/index', meta: { title: '对话' } },
          { name: 'ApprovalsCreateMenu', path: '/approvals/create', component: '/factoryos/approvals/create/index', meta: { title: '发起申请' } },
          { name: 'ApprovalsTodoMenu', path: '/approvals/todo', component: '/factoryos/approvals/todo/index', meta: { title: '待我处理' } },
          { name: 'ApprovalsMineMenu', path: '/approvals/mine', component: '/factoryos/approvals/mine/index', meta: { title: '我发起的' } },
          { name: 'ApprovalsHistoryMenu', path: '/approvals/history', component: '/factoryos/approvals/history/index', meta: { title: '审批历史' } },
          { name: 'ApprovalsRulesMenu', path: '/approvals/rules', component: '/factoryos/approvals/rules/index', meta: { title: '流程配置与规则' } },
        ],
      },
      {
        meta: { icon: 'mdi:account-group-outline', title: '员工管理' },
        name: 'HR',
        path: '/hr',
        redirect: '/hr/chat',
        children: [
          { name: 'HRChatMenu', path: '/hr/chat', component: '/factoryos/hr/chat/index', meta: { title: '对话' } },
          { name: 'HROrgMenu', path: '/hr/org', component: '/factoryos/hr/org/index', meta: { title: '组织架构' } },
          { name: 'HREmployeesMenu', path: '/hr/employees', component: '/factoryos/hr/employees/index', meta: { title: '员工档案' } },
          { name: 'HREfficiencyMenu', path: '/hr/efficiency', component: '/factoryos/hr/efficiency/index', meta: { title: '效率评估' } },
          { name: 'HRReportsMenu', path: '/hr/reports', component: '/factoryos/hr/reports/index', meta: { title: '报告生成（周报/月报）' } },
          { name: 'HRSkillsMenu', path: '/hr/skills', component: '/factoryos/hr/skills/index', meta: { title: '技能矩阵' } },
        ],
      },
      {
        meta: { icon: 'mdi:book-open-outline', title: '资料库' },
        name: 'Knowledge',
        path: '/knowledge',
        redirect: '/knowledge/chat',
        children: [
          { name: 'KnowledgeChatMenu', path: '/knowledge/chat', component: '/factoryos/knowledge/chat/index', meta: { title: '对话' } },
          { name: 'KnowledgeSolutionsMenu', path: '/knowledge/solutions', component: '/factoryos/knowledge/solutions/index', meta: { title: '方案资料库' } },
          { name: 'KnowledgePartsMenu', path: '/knowledge/parts', component: '/factoryos/knowledge/parts/index', meta: { title: '设计零件资料库' } },
          { name: 'KnowledgePLCMenu', path: '/knowledge/plc', component: '/factoryos/knowledge/plc/index', meta: { title: 'PLC 设计资料库' } },
          { name: 'KnowledgeSearchMenu', path: '/knowledge/search', component: '/factoryos/knowledge/search/index', meta: { title: '智能检索' } },
          { name: 'KnowledgeUploadMenu', path: '/knowledge/upload', component: '/factoryos/knowledge/upload/index', meta: { title: '上传与版本' } },
        ],
      },
      {
        meta: { icon: 'mdi:target-variant', title: '目标与 BI' },
        name: 'GoalsBI',
        path: '/goals-bi',
        redirect: '/goals-bi/chat',
        children: [
          { name: 'GoalsBIChatMenu', path: '/goals-bi/chat', component: '/factoryos/goals-bi/chat/index', meta: { title: '对话' } },
          { name: 'GoalsManageMenu', path: '/goals-bi/manage', component: '/factoryos/goals-bi/manage/index', meta: { title: '目标管理' } },
          { name: 'GoalsReviewMenu', path: '/goals-bi/review', component: '/factoryos/goals-bi/review/index', meta: { title: '目标审核' } },
          { name: 'BizMiningMenu', path: '/goals-bi/mining', component: '/factoryos/goals-bi/mining/index', meta: { title: '业务数据挖掘' } },
          { name: 'PromoGenMenu', path: '/goals-bi/promo', component: '/factoryos/goals-bi/promo/index', meta: { title: '宣传材料生成' } },
          { name: 'BizDashboardMenu', path: '/goals-bi/dashboard', component: '/factoryos/goals-bi/dashboard/index', meta: { title: '业务智能仪表盘' } },
        ],
      },
      {
        meta: { icon: 'mdi:link-variant', title: '数据与集成' },
        name: 'Integration',
        path: '/integration',
        redirect: '/integration/chat',
        children: [
          { name: 'IntegrationChatMenu', path: '/integration/chat', component: '/factoryos/integration/chat/index', meta: { title: '对话' } },
          { name: 'IntegrationDingtalkMenu', path: '/integration/dingtalk', component: '/factoryos/integration/dingtalk/index', meta: { title: '钉钉集成' } },
          { name: 'IntegrationDbConnectorsMenu', path: '/integration/db-connectors', component: '/factoryos/integration/db-connectors/index', meta: { title: '数据库连接器' } },
          { name: 'IntegrationSchedulerMenu', path: '/integration/scheduler', component: '/factoryos/integration/scheduler/index', meta: { title: '同步调度' } },
          { name: 'IntegrationUnifiedAccessMenu', path: '/integration/unified-access', component: '/factoryos/integration/unified-access/index', meta: { title: '统一数据访问层' } },
          { name: 'IntegrationDataQualityMenu', path: '/integration/data-quality', component: '/factoryos/integration/data-quality/index', meta: { title: '数据质量' } },
        ],
      },
      {
        meta: { icon: 'mdi:cog-outline', title: '设置与安全' },
        name: 'Settings',
        path: '/settings',
        redirect: '/settings/chat',
        children: [
          { name: 'SettingsChatMenu', path: '/settings/chat', component: '/factoryos/settings/chat/index', meta: { title: '对话' } },
          { name: 'SettingsCompanyMenu', path: '/settings/company', component: '/factoryos/settings/company/index', meta: { title: '公司切换' } },
          { name: 'SettingsRolesMenu', path: '/settings/roles', component: '/factoryos/settings/roles/index', meta: { title: '权限与角色' } },
          { name: 'SettingsDatasourcesMenu', path: '/settings/datasources', component: '/factoryos/settings/datasources/index', meta: { title: '数据源配置' } },
          { name: 'SettingsSecurityMenu', path: '/settings/security', component: '/factoryos/settings/security/index', meta: { title: '安全与认证' } },
          { name: 'SettingsAuditMenu', path: '/settings/audit', component: '/factoryos/settings/audit/index', meta: { title: '审计日志' } },
        ],
      },
      {
        meta: { icon: 'mdi:lifebuoy', title: '帮助与支持' },
        name: 'Help',
        path: '/help',
        redirect: '/help/chat',
        children: [
          { name: 'HelpChatMenu', path: '/help/chat', component: '/factoryos/help/chat/index', meta: { title: '对话' } },
          { name: 'HelpGuideMenu', path: '/help/guide', component: '/factoryos/help/guide/index', meta: { title: '使用指南' } },
          { name: 'HelpTicketsMenu', path: '/help/tickets', component: '/factoryos/help/tickets/index', meta: { title: '反馈与工单' } },
          { name: 'HelpReleaseMenu', path: '/help/release', component: '/factoryos/help/release/index', meta: { title: '版本与更新' } },
          { name: 'HelpAboutMenu', path: '/help/about', component: '/factoryos/help/about/index', meta: { title: '关于' } },
        ],
      },
      {
        meta: { icon: 'mdi:account-circle-outline', title: '个人中心' },
        name: 'Account',
        path: '/account',
        redirect: '/account/profile',
        children: [
          { name: 'AccountProfileMenu', path: '/account/profile', component: '/factoryos/account/profile/index', meta: { title: '我的资料' } },
          { name: 'AccountPreferencesMenu', path: '/account/preferences', component: '/factoryos/account/preferences/index', meta: { title: '偏好设置' } },
          { name: 'AccountFavoritesMenu', path: '/account/favorites', component: '/factoryos/account/favorites/index', meta: { title: '我的收藏' } },
          { name: 'AccountRecentMenu', path: '/account/recent', component: '/factoryos/account/recent/index', meta: { title: '最近访问' } },
        ],
      },
    ],
  },
];

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
  const roleWithMenus = {
    admin: {
      component: '/demos/access/admin-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.adminVisible',
      },
      name: 'AccessAdminVisibleDemo',
      path: '/demos/access/admin-visible',
    },
    super: {
      component: '/demos/access/super-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.superVisible',
      },
      name: 'AccessSuperVisibleDemo',
      path: '/demos/access/super-visible',
    },
    user: {
      component: '/demos/access/user-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.userVisible',
      },
      name: 'AccessUserVisibleDemo',
      path: '/demos/access/user-visible',
    },
  };

  return [
    {
      meta: {
        icon: 'ic:baseline-view-in-ar',
        keepAlive: true,
        order: 1000,
        title: 'demos.title',
      },
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/access',
      children: [
        {
          name: 'AccessDemos',
          path: '/demosaccess',
          meta: {
            icon: 'mdi:cloud-key-outline',
            title: 'demos.access.backendPermissions',
          },
          redirect: '/demos/access/page-control',
          children: [
            {
              name: 'AccessPageControlDemo',
              path: '/demos/access/page-control',
              component: '/demos/access/index',
              meta: {
                icon: 'mdi:page-previous-outline',
                title: 'demos.access.pageAccess',
              },
            },
            {
              name: 'AccessButtonControlDemo',
              path: '/demos/access/button-control',
              component: '/demos/access/button-control',
              meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.buttonControl',
              },
            },
            {
              name: 'AccessMenuVisible403Demo',
              path: '/demos/access/menu-visible-403',
              component: '/demos/access/menu-visible-403',
              meta: {
                authority: ['no-body'],
                icon: 'mdi:button-cursor',
                menuVisibleWithForbidden: true,
                title: 'demos.access.menuVisible403',
              },
            },
            roleWithMenus[role],
          ],
        },
      ],
    },
  ];
};

export const MOCK_MENUS = [
  {
    menus: [...dashboardMenus, ...factoryMenus],
    username: 'vben',
  },
  {
    menus: [...dashboardMenus, ...factoryMenus],
    username: 'admin',
  },
  {
    menus: [...dashboardMenus, ...factoryMenus],
    username: 'jack',
  },
];

export const MOCK_MENU_LIST = [
  {
    id: 1,
    name: 'Workspace',
    status: 1,
    type: 'menu',
    icon: 'mdi:dashboard',
    path: '/workspace',
    component: '/dashboard/workspace/index',
    meta: {
      icon: 'carbon:workspace',
      title: 'page.dashboard.workspace',
      affixTab: true,
      order: 0,
    },
  },
  {
    id: 2,
    meta: {
      icon: 'carbon:settings',
      order: 9997,
      title: 'system.title',
      badge: 'new',
      badgeType: 'normal',
      badgeVariants: 'primary',
    },
    status: 1,
    type: 'catalog',
    name: 'System',
    path: '/system',
    children: [
      {
        id: 201,
        pid: 2,
        path: '/system/menu',
        name: 'SystemMenu',
        authCode: 'System:Menu:List',
        status: 1,
        type: 'menu',
        meta: {
          icon: 'carbon:menu',
          title: 'system.menu.title',
        },
        component: '/system/menu/list',
        children: [
          {
            id: 20_101,
            pid: 201,
            name: 'SystemMenuCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_102,
            pid: 201,
            name: 'SystemMenuEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_103,
            pid: 201,
            name: 'SystemMenuDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
      {
        id: 202,
        pid: 2,
        path: '/system/dept',
        name: 'SystemDept',
        status: 1,
        type: 'menu',
        authCode: 'System:Dept:List',
        meta: {
          icon: 'carbon:container-services',
          title: 'system.dept.title',
        },
        component: '/system/dept/list',
        children: [
          {
            id: 20_401,
            pid: 201,
            name: 'SystemDeptCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_402,
            pid: 201,
            name: 'SystemDeptEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_403,
            pid: 201,
            name: 'SystemDeptDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
    ],
  },
  {
    id: 9,
    meta: {
      badgeType: 'dot',
      order: 9998,
      title: 'demos.vben.title',
      icon: 'carbon:data-center',
    },
    name: 'Project',
    path: '/vben-admin',
    type: 'catalog',
    status: 1,
    children: [
      {
        id: 901,
        pid: 9,
        name: 'VbenDocument',
        path: '/vben-admin/document',
        component: 'IFrameView',
        type: 'embedded',
        status: 1,
        meta: {
          icon: 'carbon:book',
          iframeSrc: 'https://doc.vben.pro',
          title: 'demos.vben.document',
        },
      },
      {
        id: 902,
        pid: 9,
        name: 'VbenGithub',
        path: '/vben-admin/github',
        component: 'IFrameView',
        type: 'link',
        status: 1,
        meta: {
          icon: 'carbon:logo-github',
          link: 'https://github.com/vbenjs/vue-vben-admin',
          title: 'Github',
        },
      },
      {
        id: 903,
        pid: 9,
        name: 'VbenAntdv',
        path: '/vben-admin/antdv',
        component: 'IFrameView',
        type: 'link',
        status: 0,
        meta: {
          icon: 'carbon:hexagon-vertical-solid',
          badgeType: 'dot',
          link: 'https://ant.vben.pro',
          title: 'demos.vben.antdv',
        },
      },
    ],
  },
  {
    id: 10,
    component: '_core/about/index',
    type: 'menu',
    status: 1,
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: 'demos.vben.about',
    },
    name: 'About',
    path: '/about',
  },
];

export function getMenuIds(menus: any[]) {
  const ids: number[] = [];
  menus.forEach((item) => {
    ids.push(item.id);
    if (item.children && item.children.length > 0) {
      ids.push(...getMenuIds(item.children));
    }
  });
  return ids;
}
