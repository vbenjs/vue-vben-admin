import type { LegacySqlService } from '../legacy-sql/legacy-sql.service';
import type { PrismaService } from '../prisma/prisma.service';

import { FinanceVoucherService } from './finance-voucher.service';

describe('FinanceVoucherService', () => {
  it('maps voucher correlation fields into stable response items', async () => {
    const legacySqlService = {
      executeNamedQuery: jest.fn().mockResolvedValue({
        items: [
          {
            availableAmount: '88.20',
            indicatorCode: 'ZB-001',
            indicatorName: '办公经费',
            paymentAmount: '100.00',
            voucherMonth: '03',
            voucherNo: 'PZ-2026-001',
            voucherStatus: '已生成',
          },
        ],
        total: 1,
      }),
    };
    const prisma = {
      budgetIndicator: {
        findMany: jest.fn().mockResolvedValue([
          {
            availableAmount: 88.2,
            id: BigInt(1),
            indicatorCode: 'ZB-001',
            indicatorName: '办公经费',
            paidAmount: 100,
            voucherMonth: '03',
            voucherNo: 'PZ-2026-001',
            voucherStatus: '已生成',
            yearBeginAmount: 200,
            yearTotalAmount: 300,
          },
        ]),
      },
    };

    const service = new FinanceVoucherService(
      legacySqlService as unknown as LegacySqlService,
      prisma as unknown as PrismaService,
    );
    const result = await service.findAll(
      { indicatorCode: 'ZB-001', keyword: '办公' },
      { fiscalYear: '2026', tenantId: 1 },
    );

    expect(legacySqlService.executeNamedQuery).toHaveBeenCalledWith(
      'account-balance-list',
      expect.objectContaining({ indicatorCode: 'ZB-001', keyword: '办公' }),
    );
    expect(result.items[0]).toMatchObject({
      availableAmount: 88.2,
      indicatorCode: 'ZB-001',
      indicatorName: '办公经费',
      paymentAmount: 100,
      voucherNo: 'PZ-2026-001',
      voucherStatus: '已生成',
    });
  });

  it('falls back to local budget indicators when legacy-sql is disabled', async () => {
    const service = new FinanceVoucherService(
      {
        getStatus: jest.fn().mockReturnValue({
          configured: false,
          enabled: false,
        }),
      } as unknown as LegacySqlService,
      {
        budgetIndicator: {
          findMany: jest.fn().mockResolvedValue([
            {
              availableAmount: 66.6,
              id: BigInt(2),
              indicatorCode: 'ZB-LOCAL-1',
              indicatorName: '本地指标',
              paidAmount: 33.4,
              updateTime: new Date('2026-03-10T08:00:00.000Z'),
              voucherMonth: '04',
              voucherNo: 'PZ-LOCAL-001',
              voucherStatus: '本地生成',
              yearBeginAmount: 100,
              yearTotalAmount: 200,
            },
          ]),
        },
      } as unknown as PrismaService,
    );

    const result = await service.findAll(
      { indicatorCode: 'ZB-LOCAL', keyword: '本地' },
      { fiscalYear: '2026', tenantId: 1 },
    );

    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      availableAmount: 66.6,
      indicatorCode: 'ZB-LOCAL-1',
      indicatorName: '本地指标',
      voucherNo: 'PZ-LOCAL-001',
      voucherStatus: '本地生成',
    });
  });
});
