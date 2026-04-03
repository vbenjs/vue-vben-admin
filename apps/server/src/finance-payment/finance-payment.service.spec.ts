import type { LegacySqlService } from '../legacy-sql/legacy-sql.service';
import type { PrismaService } from '../prisma/prisma.service';

import { FinancePaymentService } from './finance-payment.service';

describe('FinancePaymentService', () => {
  it('overlays payment method and payer fields onto payment list items', async () => {
    const legacySqlService = {
      executeNamedQuery: jest.fn().mockResolvedValue({
        items: [
          {
            amount: '200.00',
            billNo: 'ZF2026001',
            payerName: '深圳财政专户',
            status: '0',
            subject: '项目付款',
          },
        ],
        total: 1,
      }),
    };
    const prisma = {
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
    const result = await service.findAll(
      { page: 1, pageSize: 20 },
      { fiscalYear: '2026', tenantId: 1 },
    );

    expect(result.items[0]).toMatchObject({
      amount: 200,
      applicant: '深圳财政专户',
      billNo: 'ZF2026001',
      payerAccount: '6222000000000001',
      payerBank: '建设银行',
      paymentType: '银行转账',
      relationType: '对公付款',
      title: '项目付款',
    });
  });

  it('returns an empty stable response when legacy-sql is disabled', async () => {
    const service = new FinancePaymentService(
      {
        getStatus: jest.fn().mockReturnValue({
          configured: false,
          enabled: false,
        }),
      } as unknown as LegacySqlService,
      {} as PrismaService,
    );

    const result = await service.findAll(
      { page: 1, pageSize: 20 },
      { fiscalYear: '2026', tenantId: 1, tenantName: '默认账套' },
    );

    expect(result).toMatchObject({
      context: {
        fiscalYear: '2026',
        tenantId: 1,
        tenantName: '默认账套',
      },
      items: [],
      total: 0,
    });
  });
});
