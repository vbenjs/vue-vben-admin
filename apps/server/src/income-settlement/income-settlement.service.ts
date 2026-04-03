import { Injectable } from '@nestjs/common';

import { InvoiceFolderService } from '../invoice-folder/invoice-folder.service';
import { SysFormDataService } from '../sys-form-data/sys-form-data.service';

const INCOME_SETTLEMENT_FORM_ID = 90002n;

type IncomeSettlementItem = {
  amount?: number;
  applicant?: string;
  bankAccount?: string;
  bankName?: string;
  billNo?: string;
  contactType?: string;
  content?: string;
  createTime?: string;
  deptName?: string;
  fileName?: string;
  folderName?: string;
  id: string;
  invoiceAmount?: number;
  invoiceNo?: string;
  invoiceType?: string;
  isSupplement?: string;
  payeeName?: string;
  receiptMethod?: string;
  remark?: string;
  sourceType?: string;
  status?: string;
  title?: string;
  updateTime?: string;
};

@Injectable()
export class IncomeSettlementService {
  constructor(
    private readonly invoiceFolderService: InvoiceFolderService,
    private readonly sysFormDataService: SysFormDataService,
  ) {}

  async create(data: any) {
    const payload = this.normalizePayload(data);
    const result = await this.sysFormDataService.create({
      createBy: payload.applicant || 'admin',
      formData: JSON.stringify(payload),
      formId: INCOME_SETTLEMENT_FORM_ID.toString(),
      remark: payload.remark || '',
    });
    await this.syncInvoiceBinding(payload);
    return this.mergeMeta(result, payload);
  }

  async getById(id: bigint) {
    const record = await this.sysFormDataService.getById(id);
    return record ? this.parseRecord(record) : null;
  }

  async getList(page: number, pageSize: number, query: any) {
    const response = await this.sysFormDataService.getList(page, pageSize, {
      formId: INCOME_SETTLEMENT_FORM_ID.toString(),
    });
    const normalizedKeyword = `${query.keyword || ''}`.trim().toLowerCase();
    const normalizedDeptName = `${query.deptName || ''}`.trim().toLowerCase();
    const normalizedReceiptMethod = `${query.receiptMethod || ''}`.trim();
    const normalizedStatus = `${query.status || ''}`.trim();

    const items = (response.items || [])
      .map((item: any) => this.parseRecord(item))
      .filter((item) => {
        if (normalizedKeyword) {
          const haystack = [
            item.billNo,
            item.payeeName,
            item.content,
            item.invoiceNo,
            item.bankAccount,
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(normalizedKeyword)) {
            return false;
          }
        }
        if (normalizedDeptName && !`${item.deptName || ''}`.toLowerCase().includes(normalizedDeptName)) {
          return false;
        }
        if (normalizedReceiptMethod && item.receiptMethod !== normalizedReceiptMethod) {
          return false;
        }
        if (normalizedStatus && item.status !== normalizedStatus) {
          return false;
        }
        return true;
      });

    return {
      items,
      total: items.length,
    };
  }

  async remove(id: bigint) {
    const result = await this.sysFormDataService.remove(id);
    return { id: result.id };
  }

  async update(id: bigint, data: any) {
    const current = await this.getById(id);
    const payload = this.normalizePayload({
      ...(current || {}),
      ...data,
    });
    const result = await this.sysFormDataService.update(id, {
      formData: JSON.stringify(payload),
      remark: payload.remark || '',
    });
    await this.syncInvoiceBinding(payload);
    return this.mergeMeta(result, payload);
  }

  private parseRecord(record: any): IncomeSettlementItem {
    let formData: Record<string, unknown> = {};
    try {
      formData = record?.formData ? JSON.parse(record.formData) : {};
    } catch {
      formData = {};
    }

    return {
      amount: Number(formData.amount || 0),
      applicant: `${formData.applicant || ''}`,
      bankAccount: `${formData.bankAccount || ''}`,
      bankName: `${formData.bankName || ''}`,
      billNo: `${formData.billNo || ''}`,
      contactType: `${formData.contactType || ''}`,
      content: `${formData.content || ''}`,
      createTime: `${formData.createTime || record?.createTime || ''}`,
      deptName: `${formData.deptName || ''}`,
      fileName: `${formData.fileName || ''}`,
      folderName: `${formData.folderName || ''}`,
      id: `${record.id}`,
      invoiceAmount: Number(formData.invoiceAmount || 0),
      invoiceNo: `${formData.invoiceNo || ''}`,
      invoiceType: `${formData.invoiceType || ''}`,
      isSupplement: `${formData.isSupplement || '0'}`,
      payeeName: `${formData.payeeName || ''}`,
      receiptMethod: `${formData.receiptMethod || ''}`,
      remark: `${formData.remark || record?.remark || ''}`,
      sourceType: `${formData.sourceType || ''}`,
      status: `${formData.status || '0'}`,
      title: `${formData.title || ''}`,
      updateTime: `${formData.updateTime || record?.updateTime || ''}`,
    };
  }

  private mergeMeta(record: any, payload: IncomeSettlementItem) {
    return {
      ...payload,
      createTime: payload.createTime || `${record.createTime || ''}`,
      id: `${record.id}`,
      updateTime: payload.updateTime || `${record.updateTime || ''}`,
    };
  }

  private async syncInvoiceBinding(payload: IncomeSettlementItem) {
    const invoiceNos = `${payload.invoiceNo || ''}`
      .split(/[，,;；\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (invoiceNos.length === 0) {
      return;
    }

    await this.invoiceFolderService.syncInvoicesByNos({
      applicant: payload.applicant,
      billNo: payload.billNo,
      invoiceNos,
      useStatus: '1',
      userName: payload.applicant,
    });
  }

  private normalizePayload(data: any): IncomeSettlementItem {
    const now = new Date().toISOString();
    return {
      amount: Number(data.amount || 0),
      applicant: `${data.applicant || ''}`,
      bankAccount: `${data.bankAccount || ''}`,
      bankName: `${data.bankName || ''}`,
      billNo: `${data.billNo || ''}`,
      contactType: `${data.contactType || '往来单位'}`,
      content: `${data.content || ''}`,
      createTime: `${data.createTime || now}`,
      deptName: `${data.deptName || ''}`,
      fileName: `${data.fileName || ''}`,
      folderName: `${data.folderName || '默认发票夹'}`,
      id: `${data.id || ''}`,
      invoiceAmount: Number(data.invoiceAmount || 0),
      invoiceNo: `${data.invoiceNo || ''}`,
      invoiceType: `${data.invoiceType || '电子票据'}`,
      isSupplement: `${data.isSupplement || '0'}`,
      payeeName: `${data.payeeName || ''}`,
      receiptMethod: `${data.receiptMethod || '银行转账'}`,
      remark: `${data.remark || ''}`,
      sourceType: `${data.sourceType || '收入结算单'}`,
      status: `${data.status || '0'}`,
      title: `${data.title || data.content || data.billNo || ''}`,
      updateTime: now,
    };
  }
}
