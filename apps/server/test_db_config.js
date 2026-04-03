const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const configs = await prisma.sysParamConfig.findMany({
    where: { configKey: { startsWith: 'sys.tenant' } }
  });
  console.log(configs.map(c => `${c.configKey}: ${c.configValue}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
