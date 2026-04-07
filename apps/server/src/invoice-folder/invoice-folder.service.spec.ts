import type { AppRequestContext } from '../common/request-context/request-context.types';

import { InvoiceFolderService } from './invoice-folder.service';

describe('InvoiceFolderService tenant policy', () => {
  it('applies default invoice type and rejects empty invoice number when required', async () => {
    const sysFormDataService = { create: jest.fn() };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        fields: {
          'form.basic.invoiceNo': { required: true },
          'form.basic.invoiceType': { defaultValue: '电子票据' },
        },
      }),
    };

    const service = new InvoiceFolderService(
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await expect(
      service.create(
        { amount: 88.6, fileName: '票据.pdf', invoiceNo: '', invoiceType: '' },
        { tenantId: 7 } as AppRequestContext,
      ),
    ).rejects.toThrow('form.basic.invoiceNo 为必填项');
  });

  it('rejects update when readonly invoice type is changed', async () => {
    const sysFormDataService = {
      getById: jest.fn().mockResolvedValue({
        createBy: '张三',
        formData: JSON.stringify({
          amount: 88.6,
          fileName: '票据.pdf',
          folderName: '默认发票夹',
          invoiceNo: 'FP-001',
          invoiceType: '电子票据',
        }),
        id: '202',
        remark: '',
      }),
      update: jest.fn().mockResolvedValue({
        createTime: '2026-04-07T00:00:00.000Z',
        id: '202',
        updateTime: '2026-04-07T00:00:00.000Z',
      }),
    };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        attachments: {},
        fields: {
          'form.basic.invoiceType': { readonly: true },
        },
      }),
    };

    const service = new InvoiceFolderService(
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await expect(
      service.update(
        202n,
        { invoiceType: '增值税专用发票' },
        { tenantId: 7 } as AppRequestContext,
      ),
    ).rejects.toThrow('form.basic.invoiceType 为只读字段');
  });

  it('uses tenant policy invoice type default before persisting payload', async () => {
    const sysFormDataService = {
      create: jest.fn().mockResolvedValue({
        createTime: '2026-04-07T00:00:00.000Z',
        id: '202',
        updateTime: '2026-04-07T00:00:00.000Z',
      }),
    };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        fields: {
          'form.basic.invoiceNo': { required: true },
          'form.basic.invoiceType': { defaultValue: '电子票据' },
        },
      }),
    };

    const service = new InvoiceFolderService(
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await service.create(
      { amount: 88.6, fileName: '票据.pdf', invoiceNo: 'FP-001', invoiceType: '' },
      { tenantId: 7 } as AppRequestContext,
    );

    expect(sysFormDataService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: expect.stringContaining('"invoiceType":"电子票据"'),
      }),
    );
  });
});
