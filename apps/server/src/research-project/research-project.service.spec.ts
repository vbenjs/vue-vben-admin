import { BadRequestException } from '@nestjs/common';

import { ResearchProjectService } from './research-project.service';

describe('ResearchProjectService', () => {
  it('submits research projects through workflow service with a stable business number', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      researchProject: {
        findUnique: jest.fn().mockResolvedValue({
          flowStatus: '0',
          id: BigInt(1),
          projectCode: '',
          projectName: '智慧财政科研项目',
        }),
      },
    };

    const service = new ResearchProjectService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({
        businessNo: 'research-project-1',
        businessType: 'research-project',
      }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when research project is not submitted', async () => {
    const service = new ResearchProjectService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        researchProject: {
          findUnique: jest.fn().mockResolvedValue({
            flowStatus: '0',
            id: BigInt(2),
            projectCode: 'RP-2026-002',
          }),
        },
      } as any,
    );

    await expect(service.withdraw(BigInt(2), { username: 'admin' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
