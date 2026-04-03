import { BadRequestException } from '@nestjs/common';

import type { LegacySqlService } from '../legacy-sql/legacy-sql.service';
import type { PrismaService } from '../prisma/prisma.service';

import { FinanceReimbursementService } from './finance-reimbursement.service';

describe('FinanceReimbursementService', () => {
  it('maps reimbursement list records into stable response items', async () => {
    const legacySqlService = {
      executeNamedQuery: jest.fn().mockResolvedValue({
        items: [
          {
            amount: '1234.56',
            applyUserName: '张三',
            billNo: 'BX2026001',
            billTime: '2026-03-09T08:00:00.000Z',
            id: '1',
            status: '1',
            subject: '办公用品报销',
          },
        ],
        total: 1,
      }),
    };
    const prisma = {
      expenseClaim: {
        findMany: jest.fn().mockResolvedValue([
          {
            applicant: '张三',
            claimAmount: 1234.56,
            claimDate: new Date('2026-03-09T08:00:00.000Z'),
            claimNo: 'BX2026001',
            claimType: '办公费报销',
            createTime: new Date('2026-03-09T08:00:00.000Z'),
            fillDate: new Date('2026-03-09T08:00:00.000Z'),
            flowNode: '财务审核',
            flowStatus: '1',
            fundUsage: '办公用品',
            id: BigInt(1),
            payableAmount: 1234.56,
          },
        ]),
        findFirst: jest.fn().mockResolvedValue(null),
      },
      expenseClaimDetail: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const service = new FinanceReimbursementService(
      legacySqlService as unknown as LegacySqlService,
      prisma as unknown as PrismaService,
    );
    const result = await service.findAll(
      { page: 1, pageSize: 20 },
      { fiscalYear: '2026', tenantId: 1, tenantName: '默认账套' },
    );

    expect(legacySqlService.executeNamedQuery).toHaveBeenCalledWith(
      'reimbursement-list',
      expect.objectContaining({ fiscalYear: '2026', tenantId: 1 }),
    );
    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      amount: 1234.56,
      applicant: '张三',
      billNo: 'BX2026001',
      status: '1',
      title: '办公用品报销',
    });
  });

  it('rejects empty billNo when requesting detail', async () => {
    const service = new FinanceReimbursementService(
      {
        executeNamedQuery: jest.fn(),
      } as unknown as LegacySqlService,
      {
        expenseClaim: { findFirst: jest.fn() },
        expenseClaimDetail: { findMany: jest.fn() },
      } as unknown as PrismaService,
    );

    await expect(service.getDetail('')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('falls back to local expense claims when legacy-sql is disabled', async () => {
    const service = new FinanceReimbursementService(
      {
        getStatus: jest.fn().mockReturnValue({
          configured: false,
          enabled: false,
        }),
      } as unknown as LegacySqlService,
      {
        expenseClaim: {
          findMany: jest.fn().mockResolvedValue([
            {
              applicant: '李四',
              claimAmount: 500,
              claimDate: new Date('2026-03-10T08:00:00.000Z'),
              claimNo: 'BX2026002',
              claimType: '差旅报销',
              createTime: new Date('2026-03-10T08:00:00.000Z'),
              fillDate: null,
              flowNode: '部门审批',
              flowStatus: '0',
              fundUsage: '出差',
              id: BigInt(2),
              payableAmount: 500,
              remark: '本地草稿',
              status: '0',
            },
          ]),
        },
      } as unknown as PrismaService,
    );

    const result = await service.findAll({ keyword: '差旅' }, { fiscalYear: '2026', tenantId: 1 });

    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      applicant: '李四',
      billNo: 'BX2026002',
      claimType: '差旅报销',
      flowNode: '部门审批',
      status: '0',
    });
  });
});
