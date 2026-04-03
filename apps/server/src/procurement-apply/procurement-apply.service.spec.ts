import { BadRequestException } from '@nestjs/common';

import { ProcurementApplyService } from './procurement-apply.service';

describe('ProcurementApplyService', () => {
  it('submits procurement applies through workflow service', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      procurementApply: {
        findUnique: jest.fn().mockResolvedValue({
          applyNo: 'CG2026001',
          bizNode: '',
          flowStatus: '0',
          id: BigInt(1),
          projectName: '办公设备采购',
        }),
      },
    };

    const service = new ProcurementApplyService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({
        businessNo: 'CG2026001',
        businessType: 'procurement-apply',
      }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when procurement apply is not submitted', async () => {
    const service = new ProcurementApplyService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        procurementApply: {
          findUnique: jest.fn().mockResolvedValue({
            applyNo: 'CG2026002',
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
