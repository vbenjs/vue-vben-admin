import { BadRequestException } from '@nestjs/common';

import { ResearchIndicatorService } from './research-indicator.service';

describe('ResearchIndicatorService', () => {
  it('submits research indicators through workflow service with a stable business number', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      researchIndicator: {
        findUnique: jest.fn().mockResolvedValue({
          flowStatus: '0',
          id: BigInt(1),
          indicatorCode: '',
          indicatorName: '科研指标一',
        }),
      },
    };

    const service = new ResearchIndicatorService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({
        businessNo: 'research-indicator-1',
        businessType: 'research-indicator',
      }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when research indicator is not submitted', async () => {
    const service = new ResearchIndicatorService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        researchIndicator: {
          findUnique: jest.fn().mockResolvedValue({
            flowStatus: '0',
            id: BigInt(2),
            indicatorCode: 'ZB-2026-002',
          }),
        },
      } as any,
    );

    await expect(service.withdraw(BigInt(2), { username: 'admin' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
