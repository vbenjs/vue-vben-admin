import { BadRequestException } from '@nestjs/common';

import { ResearchScopeAdjustService } from './research-scope-adjust.service';

describe('ResearchScopeAdjustService', () => {
  it('submits research scope adjusts through workflow service with synthetic business number', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      researchScopeAdjust: {
        findUnique: jest.fn().mockResolvedValue({
          flowStatus: '0',
          id: BigInt(1),
          indicatorName: '科研指标A',
        }),
      },
    };

    const service = new ResearchScopeAdjustService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({
        businessNo: 'research-scope-adjust-1',
        businessType: 'research-scope-adjust',
      }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when research scope adjust is not submitted', async () => {
    const service = new ResearchScopeAdjustService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        researchScopeAdjust: {
          findUnique: jest.fn().mockResolvedValue({
            flowStatus: '0',
            id: BigInt(2),
            indicatorName: '科研指标B',
          }),
        },
      } as any,
    );

    await expect(service.withdraw(BigInt(2), { username: 'admin' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
