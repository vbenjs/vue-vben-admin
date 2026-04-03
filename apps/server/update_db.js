const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB fix...');
  const updates = [
    { key: 'sys.tenant.displayName', value: '默认开发账套' },
    { key: 'sys.tenant.voucherRule', value: '内置凭证规则' },
    { key: 'sys.tenant.budgetControlMode', value: '绝对控制' },
    { key: 'sys.tenant.fundSourceType', value: '财政拨款' },
    { key: 'sys.tenant.orgNature', value: '行政单位' },
    { key: 'sys.tenant.defaultPaymentMethod', value: '财政直接支付' },
    { key: 'sys.tenant.auxAccountingDimension', value: '项目,部门,人员' }
  ];

  for (const update of updates) {
    const result = await prisma.sysParamConfig.updateMany({
      where: { configKey: update.key },
      data: { configValue: update.value }
    });
    console.log(`Updated ${update.key}: ${result.count} rows`);
  }
  console.log('Database fix completed.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
