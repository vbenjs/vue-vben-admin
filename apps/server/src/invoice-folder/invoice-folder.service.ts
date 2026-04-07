import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Injectable } from '@nestjs/common';

import { SysFormDataService } from '../sys-form-data/sys-form-data.service';
import { SysTenantPolicyService } from '../sys-tenant-policy/sys-tenant-policy.service';
import {
  applyPolicyDefaults,
  assertPolicyPayload,
} from '../sys-tenant-policy/sys-tenant-policy.runtime';

const INVOICE_FOLDER_FORM_ID = 90001n;

type InvoiceFolderItem = {
  amount?: number;
  applicant?: string;
  billNo?: string;
  code?: string;
  createTime?: string;
  fileName?: string;
  folderName?: string;
  id: string;
  invoiceNo?: string;
  invoiceType?: string;
  remark?: string;
  sourceType?: string;
  status?: string;
  title?: string;
  updateTime?: string;
  useStatus?: string;
  userName?: string;
  verifierStatus?: string;
};

type InvoiceFieldAccessors = Record<
  string,
  {
    get: (payload: InvoiceFolderItem) => unknown;
    set?: (payload: InvoiceFolderItem, value: unknown) => void;
  }
>;

const INVOICE_FOLDER_FIELD_ACCESSORS: InvoiceFieldAccessors = {
  'form.basic.folderName': {
    get: (payload) => payload.folderName,
    set: (payload, value) => {
      payload.folderName = `${value || ''}`;
    },
  },
  'form.basic.invoiceNo': {
    get: (payload) => payload.invoiceNo,
    set: (payload, value) => {
      payload.invoiceNo = `${value || ''}`;
    },
  },
  'form.basic.invoiceType': {
    get: (payload) => payload.invoiceType,
    set: (payload, value) => {
      payload.invoiceType = `${value || ''}`;
    },
  },
};

@Injectable()
export class InvoiceFolderService {
  constructor(
    private readonly sysFormDataService: SysFormDataService,
    private readonly sysTenantPolicyService: SysTenantPolicyService,
  ) {}

  async create(data: any, requestContext?: AppRequestContext) {
    const policy = await this.sysTenantPolicyService.getPublishedPolicyByScene(
      'finance.invoice-folder',
      requestContext?.tenantId,
      'pageRuntime',
    );
    const normalized = this.normalizePayload(data);
    const payload = this.applyBusinessDefaults(
      applyPolicyDefaults(normalized, policy, INVOICE_FOLDER_FIELD_ACCESSORS),
    );
    assertPolicyPayload(payload, policy, INVOICE_FOLDER_FIELD_ACCESSORS);
    const result = await this.sysFormDataService.create({
      createBy: payload.userName || 'admin',
      formData: JSON.stringify(payload),
      formId: INVOICE_FOLDER_FORM_ID.toString(),
      remark: payload.remark || '',
    });
    return this.mergeMeta(result, payload);
  }

  async getById(id: bigint) {
    const record = await this.sysFormDataService.getById(id);
    return record ? this.parseRecord(record) : null;
  }

  async getList(page: number, pageSize: number, query: any) {
    const response = await this.sysFormDataService.getList(page, pageSize, {
      formId: INVOICE_FOLDER_FORM_ID.toString(),
    });
    const normalizedKeyword = `${query.keyword || ''}`.trim().toLowerCase();
    const normalizedFolderName = `${query.folderName || ''}`.trim().toLowerCase();
    const normalizedInvoiceType = `${query.invoiceType || ''}`.trim();
    const normalizedStatus = `${query.status || ''}`.trim();
    const normalizedUseStatus = `${query.useStatus || ''}`.trim();
    const normalizedVerifierStatus = `${query.verifierStatus || ''}`.trim();

    const items = (response.items || [])
      .map((item: any) => this.parseRecord(item))
      .filter((item) => {
        if (normalizedKeyword) {
          const haystack = [
            item.invoiceNo,
            item.fileName,
            item.folderName,
            item.title,
            item.userName,
            item.billNo,
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(normalizedKeyword)) {
            return false;
          }
        }
        if (normalizedFolderName && !`${item.folderName || ''}`.toLowerCase().includes(normalizedFolderName)) {
          return false;
        }
        if (normalizedInvoiceType && item.invoiceType !== normalizedInvoiceType) {
          return false;
        }
        if (normalizedStatus && item.status !== normalizedStatus) {
          return false;
        }
        if (normalizedUseStatus && item.useStatus !== normalizedUseStatus) {
          return false;
        }
        if (normalizedVerifierStatus && item.verifierStatus !== normalizedVerifierStatus) {
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

  async syncInvoicesByNos(params: {
    applicant?: string;
    billNo?: string;
    invoiceNos: string[];
    useStatus?: string;
    userName?: string;
  }) {
    const invoiceNos = Array.from(
      new Set(params.invoiceNos.map((item) => `${item}`.trim()).filter(Boolean)),
    );
    if (invoiceNos.length === 0) {
      return [];
    }

    const records = await this.sysFormDataService.getList(1, 1000, {
      formId: INVOICE_FOLDER_FORM_ID.toString(),
    });
    const matchedItems = (records.items || [])
      .map((item: any) => this.parseRecord(item))
      .filter((item) => invoiceNos.includes(`${item.invoiceNo || ''}`.trim()));

    const results: any[] = [];
    for (const item of matchedItems) {
      const updated = await this.update(BigInt(item.id), {
        ...item,
        applicant: params.applicant || item.applicant,
        billNo: params.billNo || item.billNo,
        useStatus: params.useStatus || '1',
        userName: params.userName || item.userName,
      });
      results.push(updated);
    }
    return results;
  }

  async update(id: bigint, data: any, requestContext?: AppRequestContext) {
    const current = await this.getById(id);
    const policy = await this.sysTenantPolicyService.getPublishedPolicyByScene(
      'finance.invoice-folder',
      requestContext?.tenantId,
      'pageRuntime',
    );
    const normalized = this.normalizePayload({
      ...(current || {}),
      ...data,
    });
    const payload = this.applyBusinessDefaults(
      applyPolicyDefaults(normalized, policy, INVOICE_FOLDER_FIELD_ACCESSORS),
    );
    assertPolicyPayload(payload, policy, INVOICE_FOLDER_FIELD_ACCESSORS, {
      originalPayload: current,
    });
    const result = await this.sysFormDataService.update(id, {
      formData: JSON.stringify(payload),
      remark: payload.remark || '',
    });
    return this.mergeMeta(result, payload);
  }

  private parseRecord(record: any): InvoiceFolderItem {
    let formData: Record<string, unknown> = {};
    try {
      formData = record?.formData ? JSON.parse(record.formData) : {};
    } catch {
      formData = {};
    }

    return {
      amount: Number(formData.amount || 0),
      applicant: `${formData.applicant || ''}`,
      billNo: `${formData.billNo || ''}`,
      code: `${formData.code || ''}`,
      createTime: `${formData.createTime || record?.createTime || ''}`,
      fileName: `${formData.fileName || ''}`,
      folderName: `${formData.folderName || ''}`,
      id: `${record.id}`,
      invoiceNo: `${formData.invoiceNo || ''}`,
      invoiceType: `${formData.invoiceType || ''}`,
      remark: `${formData.remark || record?.remark || ''}`,
      sourceType: `${formData.sourceType || ''}`,
      status: `${formData.status || '0'}`,
      title: `${formData.title || ''}`,
      updateTime: `${formData.updateTime || record?.updateTime || ''}`,
      useStatus: `${formData.useStatus || '0'}`,
      userName: `${formData.userName || record?.createBy || ''}`,
      verifierStatus: `${formData.verifierStatus || '0'}`,
    };
  }

  private mergeMeta(record: any, payload: InvoiceFolderItem) {
    return {
      ...payload,
      createTime: payload.createTime || `${record.createTime || ''}`,
      id: `${record.id}`,
      updateTime: payload.updateTime || `${record.updateTime || ''}`,
    };
  }

  private applyBusinessDefaults(payload: InvoiceFolderItem) {
    return {
      ...payload,
      folderName: `${payload.folderName || '默认发票夹'}`,
      invoiceType: `${payload.invoiceType || '增值税电子普通发票'}`,
    };
  }

  private normalizePayload(data: any): InvoiceFolderItem {
    const now = new Date().toISOString();
    return {
      amount: Number(data.amount || 0),
      applicant: `${data.applicant || ''}`,
      billNo: `${data.billNo || ''}`,
      code: `${data.code || ''}`,
      createTime: `${data.createTime || now}`,
      fileName: `${data.fileName || ''}`,
      folderName: `${data.folderName || ''}`,
      id: `${data.id || ''}`,
      invoiceNo: `${data.invoiceNo || ''}`,
      invoiceType: `${data.invoiceType || ''}`,
      remark: `${data.remark || ''}`,
      sourceType: `${data.sourceType || '手工录入'}`,
      status: `${data.status || '0'}`,
      title: `${data.title || data.fileName || data.invoiceNo || ''}`,
      updateTime: now,
      useStatus: `${data.useStatus || '0'}`,
      userName: `${data.userName || 'admin'}`,
      verifierStatus: `${data.verifierStatus || '0'}`,
    };
  }
}
