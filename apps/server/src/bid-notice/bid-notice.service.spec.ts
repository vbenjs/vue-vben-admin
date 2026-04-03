import { BadRequestException } from '@nestjs/common';

import { BidNoticeService } from './bid-notice.service';

describe('BidNoticeService', () => {
  it('submits bid notices through workflow service with synthetic business number', async () => {
    const financeWorkflowService = {
      executeCommand: jest.fn().mockResolvedValue({ id: '1' }),
      getHistory: jest.fn(),
    };
    const prisma = {
      bidNotice: {
        findUnique: jest.fn().mockResolvedValue({
          flowStatus: '0',
          id: BigInt(1),
          noticeTitle: '采购招标公告',
        }),
      },
    };

    const service = new BidNoticeService(financeWorkflowService as any, prisma as any);
    await service.submit(BigInt(1), { realName: '管理员', userId: '1', username: 'admin' });

    expect(financeWorkflowService.executeCommand).toHaveBeenCalledWith(
      'submit',
      expect.objectContaining({
        businessNo: 'bid-notice-1',
        businessType: 'bid-notice',
      }),
      expect.objectContaining({ username: 'admin' }),
    );
  });

  it('rejects withdraw when bid notice is not submitted', async () => {
    const service = new BidNoticeService(
      { executeCommand: jest.fn(), getHistory: jest.fn() } as any,
      {
        bidNotice: {
          findUnique: jest.fn().mockResolvedValue({
            flowStatus: '0',
            id: BigInt(2),
            noticeTitle: '采购招标公告2',
          }),
        },
      } as any,
    );

    await expect(service.withdraw(BigInt(2), { username: 'admin' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
