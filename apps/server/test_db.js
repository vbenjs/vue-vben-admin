const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.sysUser.findFirst();
  console.log('User nickname:', user?.nickName || user?.userName);
  console.log('User remark:', user?.remark);
  
  const menu = await prisma.sysMenu.findFirst({ where: { menuType: 'C' } });
  console.log('First menu path:', menu?.path);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
