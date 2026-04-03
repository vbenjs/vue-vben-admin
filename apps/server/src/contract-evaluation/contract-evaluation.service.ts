import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
function getYearRange(fiscalYear?: string) {
  if (!fiscalYear || !/^\d{4}$/.test(fiscalYear)) return null;
  const start = new Date(`${fiscalYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${Number(fiscalYear) + 1}-01-01T00:00:00.000Z`);
  return { gte: start, lt: end };
}
@Injectable()
export class ContractEvaluationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.contractEvaluation.create({
      data: { ...payload, createBy: username },
    });
    return this.serialize(result);
  }
  async findAll(
    params: {
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      contractName?: string;
      evaluator?: string;
      evaluationStatus?: string;
      status?: string;
    },
    requestContext: AppRequestContext = {},
  ) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const fiscalYear = (params.fiscalYear || requestContext.fiscalYear || '').trim();
    const dateWhere = getYearRange(fiscalYear);
    const where = {
      ...(dateWhere ? { evaluationDate: dateWhere } : {}),
      ...(params.contractName ? { contractName: { contains: params.contractName } } : {}),
      ...(params.evaluator ? { evaluator: { contains: params.evaluator } } : {}),
      ...(params.evaluationStatus ? { evaluationStatus: params.evaluationStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.contractEvaluation.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.contractEvaluation.count({ where }),
    ]);
    return {
      context: {
        fiscalYear,
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: items.map((item) => this.serialize(item)),
      total,
    };
  }
  async findOne(id: bigint) {
    const result = await this.prisma.contractEvaluation.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }
  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.contractEvaluation.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }
  async remove(id: bigint) {
    const result = await this.prisma.contractEvaluation.delete({ where: { id } });
    return this.serialize(result);
  }
  private normalizePayload(data: any, requestContext: AppRequestContext) {
    return {
      contractAmount: data.contractAmount ?? 0,
      contractApplyNo: data.contractApplyNo || '',
      contractCategory: data.contractCategory || '',
      contractId: data.contractId ? BigInt(data.contractId) : undefined,
      contractName: data.contractName || '',
      contractNo: data.contractNo || '',
      evaluationContent: data.evaluationContent || '',
      evaluationDate: this.parseDate(data.evaluationDate, requestContext.fiscalYear),
      evaluationLevel: data.evaluationLevel || '',
      evaluationStatus: data.evaluationStatus || '0',
      evaluator: data.evaluator || '',
      partyAUnit: data.partyAUnit || '',
      partyBUnit: data.partyBUnit || '',
      procureMethod: data.procureMethod || '',
      procureType: data.procureType || '',
      projectName: data.projectName || '',
      remark: data.remark || '',
      status: data.status || '0',
    } as any;
  }
  private parseDate(value?: string, fallbackFiscalYear?: string) {
    if (value) return new Date(value);
    if (fallbackFiscalYear && /^\d{4}$/.test(fallbackFiscalYear))
      return new Date(`${fallbackFiscalYear}-01-01T00:00:00.000Z`);
    return undefined;
  }
  private serialize(item: any) {
    return { ...item, id: item.id.toString(), contractId: item.contractId?.toString() };
  }
}
