import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ==================== 1. 部门 ====================
  await prisma.sysDept.createMany({
    data: [
      {
        deptName: 'RISS科技集团',
        parentId: 0,
        orderNum: 0,
        leader: '张总',
        phone: '13800000001',
        email: 'group@riss.com',
        status: '0',
        createBy: 'admin',
      },
      {
        deptName: '深圳总公司',
        parentId: 1,
        orderNum: 1,
        leader: '李总',
        phone: '13800000002',
        email: 'sz@riss.com',
        status: '0',
        createBy: 'admin',
      },
      {
        deptName: '研发部门',
        parentId: 2,
        orderNum: 1,
        leader: '王工',
        phone: '13800000003',
        email: 'dev@riss.com',
        status: '0',
        createBy: 'admin',
      },
      {
        deptName: '测试部门',
        parentId: 2,
        orderNum: 2,
        leader: '赵工',
        phone: '13800000004',
        email: 'test@riss.com',
        status: '0',
        createBy: 'admin',
      },
      {
        deptName: '财务部门',
        parentId: 2,
        orderNum: 3,
        leader: '钱会计',
        phone: '13800000005',
        email: 'fin@riss.com',
        status: '0',
        createBy: 'admin',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 部门数据已填充');

  // ==================== 2. 岗位 ====================
  await prisma.sysPost.createMany({
    data: [
      { postCode: 'ceo', postName: '董事长', postSort: 1, status: '0', createBy: 'admin' },
      { postCode: 'se', postName: '项目经理', postSort: 2, status: '0', createBy: 'admin' },
      { postCode: 'hr', postName: '人力资源', postSort: 3, status: '0', createBy: 'admin' },
      { postCode: 'dev', postName: '开发工程师', postSort: 4, status: '0', createBy: 'admin' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 岗位数据已填充');

  // ==================== 3. 角色 ====================
  // 角色已在之前创建过 TestRole，这里确保有管理员角色
  const existingAdmin = await prisma.sysRole.findFirst({ where: { roleKey: 'admin' } });
  if (!existingAdmin) {
    await prisma.sysRole.create({
      data: {
        roleName: '超级管理员',
        roleKey: 'admin',
        roleSort: 1,
        dataScope: '1',
        status: '0',
        createBy: 'admin',
        remark: '超级管理员角色',
      },
    });
  }
  const existingCommon = await prisma.sysRole.findFirst({ where: { roleKey: 'common' } });
  if (!existingCommon) {
    await prisma.sysRole.create({
      data: {
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        dataScope: '2',
        status: '0',
        createBy: 'admin',
        remark: '普通角色',
      },
    });
  }
  console.log('✅ 角色数据已填充');

  // ==================== 4. 菜单（顶级目录 + 子菜单） ====================
  const menuCount = await prisma.sysMenu.count();
  if (menuCount === 0) {
    await prisma.sysMenu.createMany({
      data: [
        // 顶级目录
        {
          menuName: '系统管理',
          parentId: 0,
          orderNum: 1,
          path: '/system',
          component: '',
          menuType: 'M',
          visible: '0',
          status: '0',
          perms: '',
          icon: 'ant-design:setting-outlined',
          createBy: 'admin',
        },
        // 子菜单
        {
          menuName: '用户管理',
          parentId: 1,
          orderNum: 1,
          path: 'user',
          component: 'sys/user/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:user:list',
          icon: 'ant-design:user-outlined',
          createBy: 'admin',
        },
        {
          menuName: '角色管理',
          parentId: 1,
          orderNum: 2,
          path: 'role',
          component: 'sys/role/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:role:list',
          icon: 'ant-design:team-outlined',
          createBy: 'admin',
        },
        {
          menuName: '菜单管理',
          parentId: 1,
          orderNum: 3,
          path: 'menu',
          component: 'sys/menu/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:menu:list',
          icon: 'ant-design:menu-outlined',
          createBy: 'admin',
        },
        {
          menuName: '部门管理',
          parentId: 1,
          orderNum: 4,
          path: 'dept',
          component: 'sys/dept/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:dept:list',
          icon: 'ant-design:apartment-outlined',
          createBy: 'admin',
        },
        {
          menuName: '岗位管理',
          parentId: 1,
          orderNum: 5,
          path: 'post',
          component: 'sys/post/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:post:list',
          icon: 'ant-design:idcard-outlined',
          createBy: 'admin',
        },
        {
          menuName: '字典管理',
          parentId: 1,
          orderNum: 6,
          path: 'dict',
          component: 'sys/dict/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:dict:list',
          icon: 'ant-design:book-outlined',
          createBy: 'admin',
        },
        {
          menuName: '操作日志',
          parentId: 1,
          orderNum: 7,
          path: 'operlog',
          component: 'sys/operlog/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:operlog:list',
          icon: 'ant-design:file-text-outlined',
          createBy: 'admin',
        },
        {
          menuName: '登录日志',
          parentId: 1,
          orderNum: 8,
          path: 'logininfor',
          component: 'sys/logininfor/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:logininfor:list',
          icon: 'ant-design:login-outlined',
          createBy: 'admin',
        },
        {
          menuName: '定时任务',
          parentId: 1,
          orderNum: 9,
          path: 'job',
          component: 'sys/job/index',
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: 'system:job:list',
          icon: 'ant-design:clock-circle-outlined',
          createBy: 'admin',
        },
        // 按钮权限
        {
          menuName: '用户新增',
          parentId: 2,
          orderNum: 1,
          path: '',
          component: '',
          menuType: 'F',
          visible: '0',
          status: '0',
          perms: 'system:user:add',
          icon: '#',
          createBy: 'admin',
        },
        {
          menuName: '用户修改',
          parentId: 2,
          orderNum: 2,
          path: '',
          component: '',
          menuType: 'F',
          visible: '0',
          status: '0',
          perms: 'system:user:edit',
          icon: '#',
          createBy: 'admin',
        },
        {
          menuName: '用户删除',
          parentId: 2,
          orderNum: 3,
          path: '',
          component: '',
          menuType: 'F',
          visible: '0',
          status: '0',
          perms: 'system:user:remove',
          icon: '#',
          createBy: 'admin',
        },
      ],
      skipDuplicates: true,
    });
  }

  let systemMenuRoot = await prisma.sysMenu.findFirst({
    where: { menuName: '系统管理' },
  });

  if (!systemMenuRoot) {
    systemMenuRoot = await prisma.sysMenu.create({
      data: {
        menuName: '系统管理',
        parentId: 0,
        orderNum: 100,
        path: '/sys',
        component: 'BasicLayout',
        menuType: 'M',
        visible: '0',
        status: '0',
        perms: '',
        icon: 'ant-design:setting-outlined',
        createBy: 'admin',
      },
    });
  }

  const systemChildMenus = [
    {
      menuName: '基础设置',
      path: '/sys/config',
      component: '/sys/config/index',
      perms: 'system:config:list',
      icon: 'lucide:sliders-horizontal',
      orderNum: 1,
    },
    {
      menuName: '字典管理',
      path: '/sys/dict',
      component: '/sys/dict/index',
      perms: 'system:dict:list',
      icon: 'lucide:book-marked',
      orderNum: 2,
    },
    {
      menuName: '用户管理',
      path: '/sys/user',
      component: '/sys/user/index',
      perms: 'system:user:list',
      icon: 'lucide:users',
      orderNum: 3,
    },
    {
      menuName: '角色管理',
      path: '/sys/role',
      component: '/sys/role/index',
      perms: 'system:role:list',
      icon: 'lucide:user-check',
      orderNum: 4,
    },
    {
      menuName: '组织架构',
      path: '/sys/dept',
      component: '/sys/dept/index',
      perms: 'system:dept:list',
      icon: 'lucide:network',
      orderNum: 5,
    },
    {
      menuName: '岗位管理',
      path: '/sys/post',
      component: '/sys/post/index',
      perms: 'system:post:list',
      icon: 'lucide:briefcase',
      orderNum: 6,
    },
    {
      menuName: '菜单管理',
      path: '/sys/menu',
      component: '/sys/menu/index',
      perms: 'system:menu:list',
      icon: 'lucide:menu',
      orderNum: 7,
    },
    {
      menuName: '租户管理',
      path: '/sys/tenant',
      component: '/sys/tenant/index',
      perms: 'system:tenant:list',
      icon: 'lucide:building-2',
      orderNum: 8,
    },
    {
      menuName: '操作日志',
      path: '/sys/operlog',
      component: '/sys/oper-log/index',
      perms: 'system:operlog:list',
      icon: 'lucide:clipboard-list',
      orderNum: 9,
    },
    {
      menuName: '登录日志',
      path: '/sys/logininfor',
      component: '/sys/logininfor/index',
      perms: 'system:logininfor:list',
      icon: 'lucide:log-in',
      orderNum: 10,
    },
    {
      menuName: '定时任务',
      path: '/sys/job',
      component: '/sys/job/index',
      perms: 'system:job:list',
      icon: 'lucide:clock',
      orderNum: 11,
    },
    {
      menuName: '单据编码',
      path: '/sys/doc-code',
      component: '/sys/doc-code/index',
      perms: 'system:doc-code:list',
      icon: 'lucide:file-code',
      orderNum: 12,
    },
  ];

  for (const menu of systemChildMenus) {
    const existingMenu = await prisma.sysMenu.findFirst({
      where: {
        menuName: menu.menuName,
        parentId: systemMenuRoot.menuId,
      },
    });

    if (!existingMenu) {
      await prisma.sysMenu.create({
        data: {
          menuName: menu.menuName,
          parentId: systemMenuRoot.menuId,
          orderNum: menu.orderNum,
          path: menu.path,
          component: menu.component,
          menuType: 'C',
          visible: '0',
          status: '0',
          perms: menu.perms,
          icon: menu.icon,
          createBy: 'admin',
        },
      });
    }
  }

  console.log('✅ 菜单数据已填充');

  const seededAdminRole = await prisma.sysRole.findFirst({ where: { roleKey: 'admin' } });
  if (seededAdminRole) {
    const menus = await prisma.sysMenu.findMany({ select: { menuId: true } });
    for (const menu of menus) {
      await prisma.sysRoleMenu.upsert({
        where: {
          roleId_menuId: {
            roleId: seededAdminRole.roleId,
            menuId: menu.menuId,
          },
        },
        update: {},
        create: {
          roleId: seededAdminRole.roleId,
          menuId: menu.menuId,
        },
      });
    }
  }

  console.log('✅ 角色菜单关联已填充');

  // ==================== 5. 用户 ====================
  const existingUser = await prisma.sysUser.findFirst({ where: { userName: 'admin' } });
  if (!existingUser) {
    await prisma.sysUser.create({
      data: {
        userName: 'admin',
        nickName: '系统管理员',
        userType: '00',
        email: 'admin@riss.com',
        phonenumber: '15888888888',
        sex: '1',
        password: '123456',
        status: '0',
        deptId: BigInt(2),
        createBy: 'admin',
        remark: '管理员',
      },
    });
  }
  const existingUser2 = await prisma.sysUser.findFirst({ where: { userName: 'testuser' } });
  if (!existingUser2) {
    await prisma.sysUser.create({
      data: {
        userName: 'testuser',
        nickName: '测试用户',
        userType: '00',
        email: 'test@riss.com',
        phonenumber: '15666666666',
        sex: '2',
        password: '123456',
        status: '0',
        deptId: BigInt(3),
        createBy: 'admin',
        remark: '测试账号',
      },
    });
  }
  console.log('✅ 用户数据已填充');

  const adminUser = await prisma.sysUser.findFirst({ where: { userName: 'admin' } });
  const testUser = await prisma.sysUser.findFirst({ where: { userName: 'testuser' } });
  const adminRole = await prisma.sysRole.findFirst({ where: { roleKey: 'admin' } });
  const commonRole = await prisma.sysRole.findFirst({ where: { roleKey: 'common' } });

  if (adminUser && adminRole) {
    await prisma.sysUserRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.userId,
          roleId: adminRole.roleId,
        },
      },
      update: {},
      create: {
        userId: adminUser.userId,
        roleId: adminRole.roleId,
      },
    });
  }

  if (testUser && commonRole) {
    await prisma.sysUserRole.upsert({
      where: {
        userId_roleId: {
          userId: testUser.userId,
          roleId: commonRole.roleId,
        },
      },
      update: {},
      create: {
        userId: testUser.userId,
        roleId: commonRole.roleId,
      },
    });
  }

  console.log('✅ 用户角色关联已填充');

  const existingTenant = await prisma.sysTenant.findFirst({
    where: { tenantName: '默认租户' },
  });
  if (!existingTenant) {
    await prisma.sysTenant.create({
      data: {
        tenantName: '默认租户',
        status: '0',
        createBy: 'admin',
        remark: '系统默认租户',
      },
    });
  }
  console.log('✅ 租户数据已填充');

  // ==================== 6. 字典分类 ====================
  await prisma.sysDictType.createMany({
    data: [
      {
        dictName: '用户性别',
        dictType: 'sys_user_sex',
        status: '0',
        createBy: 'admin',
        remark: '性别列表',
      },
      {
        dictName: '系统开关',
        dictType: 'sys_normal_disable',
        status: '0',
        createBy: 'admin',
        remark: '正常或停用',
      },
      {
        dictName: '菜单状态',
        dictType: 'sys_show_hide',
        status: '0',
        createBy: 'admin',
        remark: '菜单状态列表',
      },
      {
        dictName: '系统是否',
        dictType: 'sys_yes_no',
        status: '0',
        createBy: 'admin',
        remark: '系统是否列表',
      },
      {
        dictName: '任务状态',
        dictType: 'sys_job_status',
        status: '0',
        createBy: 'admin',
        remark: '任务状态列表',
      },
      {
        dictName: '任务分组',
        dictType: 'sys_job_group',
        status: '0',
        createBy: 'admin',
        remark: '任务分组列表',
      },
      {
        dictName: '操作类型',
        dictType: 'sys_oper_type',
        status: '0',
        createBy: 'admin',
        remark: '操作类型列表',
      },
    ],
    skipDuplicates: true,
  });

  // ==================== 7. 字典键值 ====================
  await prisma.sysDictData.createMany({
    data: [
      {
        dictSort: 1,
        dictLabel: '男',
        dictValue: '1',
        dictType: 'sys_user_sex',
        listClass: 'default',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 2,
        dictLabel: '女',
        dictValue: '2',
        dictType: 'sys_user_sex',
        listClass: 'error',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 3,
        dictLabel: '未知',
        dictValue: '0',
        dictType: 'sys_user_sex',
        listClass: 'warning',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 1,
        dictLabel: '正常',
        dictValue: '0',
        dictType: 'sys_normal_disable',
        listClass: 'success',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 2,
        dictLabel: '停用',
        dictValue: '1',
        dictType: 'sys_normal_disable',
        listClass: 'error',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 1,
        dictLabel: '显示',
        dictValue: '0',
        dictType: 'sys_show_hide',
        listClass: 'success',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 2,
        dictLabel: '隐藏',
        dictValue: '1',
        dictType: 'sys_show_hide',
        listClass: 'error',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 1,
        dictLabel: '是',
        dictValue: 'Y',
        dictType: 'sys_yes_no',
        listClass: 'success',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 2,
        dictLabel: '否',
        dictValue: 'N',
        dictType: 'sys_yes_no',
        listClass: 'error',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 1,
        dictLabel: '正常',
        dictValue: '0',
        dictType: 'sys_job_status',
        listClass: 'success',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 2,
        dictLabel: '暂停',
        dictValue: '1',
        dictType: 'sys_job_status',
        listClass: 'error',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 1,
        dictLabel: '默认',
        dictValue: 'DEFAULT',
        dictType: 'sys_job_group',
        listClass: 'default',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 2,
        dictLabel: '系统',
        dictValue: 'SYSTEM',
        dictType: 'sys_job_group',
        listClass: 'warning',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 1,
        dictLabel: '新增',
        dictValue: '1',
        dictType: 'sys_oper_type',
        listClass: 'default',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 2,
        dictLabel: '修改',
        dictValue: '2',
        dictType: 'sys_oper_type',
        listClass: 'default',
        status: '0',
        createBy: 'admin',
      },
      {
        dictSort: 3,
        dictLabel: '删除',
        dictValue: '3',
        dictType: 'sys_oper_type',
        listClass: 'error',
        status: '0',
        createBy: 'admin',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 字典数据已填充');

  // ==================== 8. 定时任务 ====================
  const jobCount = await prisma.sysJob.count();
  if (jobCount === 0) {
    await prisma.sysJob.create({
      data: {
        jobName: '系统默认（无参）',
        jobGroup: 'DEFAULT',
        invokeTarget: 'ryTask.ryNoParams',
        cronExpression: '0/10 * * * * ?',
        misfirePolicy: '3',
        concurrent: '1',
        status: '0',
        createBy: 'admin',
        remark: '系统默认定时任务',
      },
    });
  }
  console.log('✅ 定时任务数据已填充');

  // ==================== 9. 操作日志（示例） ====================
  const operLogCount = await prisma.sysOperLog.count();
  if (operLogCount === 0) {
    await prisma.sysOperLog.create({
      data: {
        title: '用户管理',
        businessType: 1,
        method: 'SysUserController.create',
        requestMethod: 'POST',
        operatorType: 1,
        operName: 'admin',
        deptName: '深圳总公司',
        operUrl: '/api/sys/user',
        operIp: '127.0.0.1',
        operLocation: '本地',
        operParam: '{"userName":"testuser"}',
        jsonResult: '{"code":200}',
        status: 0,
      },
    });
  }
  console.log('✅ 操作日志数据已填充');

  // ==================== 10. 登录日志（示例） ====================
  const loginCount = await prisma.sysLogininfor.count();
  if (loginCount === 0) {
    await prisma.sysLogininfor.create({
      data: {
        userName: 'admin',
        ipaddr: '127.0.0.1',
        loginLocation: '本地',
        browser: 'Chrome 120',
        os: 'Windows 10',
        status: '0',
        msg: '登录成功',
      },
    });
  }
  console.log('✅ 登录日志数据已填充');

  console.log('\n🎉 全部种子数据填充完毕！');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
