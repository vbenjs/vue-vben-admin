import { BadRequestException } from '@nestjs/common';

import { ExpenseClaimService } from './expense-claim.service';

describe('ExpenseClaimService', () => {
  it('submits unsubmitted expense claims through workflow service', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      expenseClaim: {
        findUnique: jest.fn().mockResolvedValue({
          claimNo: 'BX2026001',
          claimType: '日常报销',
          flowNode: '',
          flowStatus: '0',
          id: BigInt(1),
        }),
      },
    };

    const service = new ExpenseClaimService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({ businessNo: 'BX2026001', businessType: 'expense-claim' }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when expense claim is not submitted', async () => {
    const service = new ExpenseClaimService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        expenseClaim: {
          findUnique: jest.fn().mockResolvedValue({
            claimNo: 'BX2026002',
            flowStatus: '0',
            id: BigInt(2),
          }),
        },
      } as any,
    );

    await expect(service.withdraw(BigInt(2), { username: 'admin' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
