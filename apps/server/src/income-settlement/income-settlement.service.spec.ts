import type { AppRequestContext } from '../common/request-context/request-context.types';

import { IncomeSettlementService } from './income-settlement.service';

describe('IncomeSettlementService tenant policy', () => {
  it('rejects create when tenant policy marks content as required', async () => {
    const invoiceFolderService = { syncInvoicesByNos: jest.fn() };
    const sysFormDataService = { create: jest.fn() };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        fields: {
          'form.basic.content': { required: true },
          'form.basic.receiptMethod': {
            defaultValue: '银行转账',
            readonly: true,
          },
        },
      }),
    };

    const service = new IncomeSettlementService(
      invoiceFolderService as any,
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await expect(
      service.create(
        { amount: 100, applicant: '张三', content: '' },
        { tenantId: 7 } as AppRequestContext,
      ),
    ).rejects.toThrow('form.basic.content 为必填项');
  });

  it('rejects create when readonly receipt method is overridden', async () => {
    const invoiceFolderService = { syncInvoicesByNos: jest.fn() };
    const sysFormDataService = {
      create: jest.fn().mockResolvedValue({
        createTime: '2026-04-07T00:00:00.000Z',
        id: '102',
        updateTime: '2026-04-07T00:00:00.000Z',
      }),
    };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        attachments: {},
        fields: {
          'form.basic.receiptMethod': {
            defaultValue: '银行转账',
            readonly: true,
          },
        },
      }),
    };

    const service = new IncomeSettlementService(
      invoiceFolderService as any,
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await expect(
      service.create(
        {
          amount: 100,
          applicant: '张三',
          content: '咨询费',
          receiptMethod: '自有资金支付',
        },
        { tenantId: 7 } as AppRequestContext,
      ),
    ).rejects.toThrow('form.basic.receiptMethod 为只读字段');
  });

  it('rejects create when invoice attachments exceed tenant policy max count', async () => {
    const invoiceFolderService = { syncInvoicesByNos: jest.fn() };
    const sysFormDataService = {
      create: jest.fn().mockResolvedValue({
        createTime: '2026-04-07T00:00:00.000Z',
        id: '103',
        updateTime: '2026-04-07T00:00:00.000Z',
      }),
    };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        attachments: {
          'attachment.invoice': { maxCount: 1 },
        },
        fields: {},
      }),
    };

    const service = new IncomeSettlementService(
      invoiceFolderService as any,
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await expect(
      service.create(
        {
          amount: 100,
          applicant: '张三',
          attachments: [{ name: 'a.pdf' }, { name: 'b.pdf' }],
          content: '咨询费',
        },
        { tenantId: 7 } as AppRequestContext,
      ),
    ).rejects.toThrow('attachment.invoice 最多上传 1 个附件');
  });

  it('applies tenant policy defaults before persisting create payload', async () => {
    const invoiceFolderService = { syncInvoicesByNos: jest.fn() };
    const sysFormDataService = {
      create: jest.fn().mockResolvedValue({
        createTime: '2026-04-07T00:00:00.000Z',
        id: '101',
        updateTime: '2026-04-07T00:00:00.000Z',
      }),
    };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        fields: {
          'form.basic.content': { required: true },
          'form.basic.receiptMethod': {
            defaultValue: '银行转账',
            readonly: true,
          },
        },
      }),
    };

    const service = new IncomeSettlementService(
      invoiceFolderService as any,
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await service.create(
      { amount: 100, applicant: '张三', content: '咨询费', receiptMethod: '' },
      { tenantId: 7 } as AppRequestContext,
    );

    expect(sysFormDataService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: expect.stringContaining('"receiptMethod":"银行转账"'),
      }),
    );
  });
});
