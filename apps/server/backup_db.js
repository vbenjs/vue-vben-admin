const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting backup...');
  // 1. SELECT properties
  const configs = await prisma.sysParamConfig.findMany({
    where: { configKey: { startsWith: 'sys.tenant' } }
  });
  
  const backupPath = path.join(__dirname, '../../sysParamConfig_backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(configs, null, 2), 'utf8');
  console.log(`Successfully backed up ${configs.length} rows to ${backupPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
