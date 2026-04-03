import { BadRequestException } from '@nestjs/common';

import { ProcurementResultService } from './procurement-result.service';

describe('ProcurementResultService', () => {
  it('submits procurement results through workflow service', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      procurementResult: {
        findUnique: jest.fn().mockResolvedValue({
          applyNo: 'CGJG2026001',
          flowStatus: '0',
          id: BigInt(1),
          projectName: '设备采购结果',
        }),
      },
    };

    const service = new ProcurementResultService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({
        businessNo: 'CGJG2026001',
        businessType: 'procurement-result',
      }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when procurement result is not submitted', async () => {
    const service = new ProcurementResultService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        procurementResult: {
          findUnique: jest.fn().mockResolvedValue({
            applyNo: 'CGJG2026002',
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
