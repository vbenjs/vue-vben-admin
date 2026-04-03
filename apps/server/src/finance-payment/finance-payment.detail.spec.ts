import type { LegacySqlService } from '../legacy-sql/legacy-sql.service';
import type { PrismaService } from '../prisma/prisma.service';

import { FinancePaymentService } from './finance-payment.service';

describe('FinancePaymentService detail', () => {
  it('overlays payer and payee fields on payment detail items', async () => {
    const legacySqlService = {
      executeNamedQuery: jest.fn().mockResolvedValue({
        items: [
          {
            billNo: 'ZF2026001',
            payeeName: '深圳供应商A',
            payerName: '深圳财政专户',
          },
        ],
        total: 1,
      }),
    };
    const prisma = {
      expensePayee: {
        findMany: jest.fn().mockResolvedValue([
          {
            accountType: '对公',
            bankAccount: '6222333300000001',
            bankName: '招商银行',
            budgetUnit: '财政局',
            payeeName: '深圳供应商A',
          },
        ]),
      },
      expensePayer: {
        findMany: jest.fn().mockResolvedValue([
          {
            bankAccount: '6222000000000001',
            bankName: '建设银行',
            payerName: '深圳财政专户',
            relatedUnit: '市本级',
          },
        ]),
      },
      paymentMethod: {
        findMany: jest.fn().mockResolvedValue([
          {
            payerAccount: '6222000000000001',
            payerBank: '建设银行',
            payerName: '深圳财政专户',
            payerUnit: '市本级',
            paymentType: '银行转账',
            relationType: '对公付款',
          },
        ]),
      },
    };

    const service = new FinancePaymentService(
      legacySqlService as unknown as LegacySqlService,
      prisma as unknown as PrismaService,
    );
    const result = await service.getDetail('ZF2026001', { tenantId: 1 });

    expect(result.items[0]).toMatchObject({
      payeeAccount: '6222333300000001',
      payeeBank: '招商银行',
      payeeBudgetUnit: '财政局',
      payeeType: '对公',
      payerAccount: '6222000000000001',
      payerBank: '建设银行',
      payerUnit: '市本级',
      paymentType: '银行转账',
      relationType: '对公付款',
    });
  });
});
