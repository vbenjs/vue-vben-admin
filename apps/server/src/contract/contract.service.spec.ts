import { BadRequestException } from '@nestjs/common';

import { ContractService } from './contract.service';

describe('ContractService', () => {
  it('submits contracts through workflow service and prefers contractNo as business number', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      contract: {
        findUnique: jest.fn().mockResolvedValue({
          bizNode: '',
          contractName: '软件采购合同',
          contractNo: 'HT2026001',
          flowStatus: '0',
          id: BigInt(1),
        }),
      },
    };

    const service = new ContractService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({ businessNo: 'HT2026001', businessType: 'contract' }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when contract is not submitted', async () => {
    const service = new ContractService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        contract: {
          findUnique: jest.fn().mockResolvedValue({
            contractNo: 'HT2026002',
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
