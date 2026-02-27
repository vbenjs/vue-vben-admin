import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 填充字典分类
  await prisma.sysDictType.createMany({
    data: [
      { dictName: '用户性别', dictType: 'sys_user_sex', status: '0', createBy: 'admin', remark: '性别列表' },
      { dictName: '系统开关', dictType: 'sys_normal_disable', status: '0', createBy: 'admin', remark: '正常或停用' },
    ],
    skipDuplicates: true
  });

  // 填充字典键值
  await prisma.sysDictData.createMany({
    data: [
      { dictSort: 1, dictLabel: '男', dictValue: '1', dictType: 'sys_user_sex', listClass: 'default', status: '0', createBy: 'admin' },
      { dictSort: 2, dictLabel: '女', dictValue: '2', dictType: 'sys_user_sex', listClass: 'error', status: '0', createBy: 'admin' },
      { dictSort: 3, dictLabel: '未知', dictValue: '0', dictType: 'sys_user_sex', listClass: 'warning', status: '0', createBy: 'admin' },
      { dictSort: 1, dictLabel: '正常', dictValue: '1', dictType: 'sys_normal_disable', listClass: 'success', status: '0', createBy: 'admin' },
      { dictSort: 2, dictLabel: '停用', dictValue: '0', dictType: 'sys_normal_disable', listClass: 'error', status: '0', createBy: 'admin' },
    ],
    skipDuplicates: true
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
