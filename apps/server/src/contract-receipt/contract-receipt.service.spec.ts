import { BadRequestException } from '@nestjs/common';

import { ContractReceiptService } from './contract-receipt.service';

describe('ContractReceiptService', () => {
  it('submits unsubmitted contract receipts through workflow service', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      contractReceipt: {
        findUnique: jest.fn().mockResolvedValue({
          contractName: '服务合同',
          flowNode: '',
          flowStatus: '0',
          id: BigInt(1),
          receiptNo: 'SK2026001',
        }),
      },
    };

    const service = new ContractReceiptService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({ businessNo: 'SK2026001', businessType: 'contract-receipt' }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when contract receipt is not submitted', async () => {
    const service = new ContractReceiptService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        contractReceipt: {
          findUnique: jest.fn().mockResolvedValue({
            flowStatus: '0',
            id: BigInt(2),
            receiptNo: 'SK2026002',
          }),
        },
      } as any,
    );

    await expect(service.withdraw(BigInt(2), { username: 'admin' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
