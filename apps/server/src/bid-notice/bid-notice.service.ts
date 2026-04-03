import type { AppRequestContext } from '../common/request-context/request-context.types';

import { BadRequestException, Injectable } from '@nestjs/common';

import { FinanceWorkflowService } from '../finance-workflow/finance-workflow.service';
import { PrismaService } from '../prisma/prisma.service';

function getYearRange(fiscalYear?: string) {
  if (!fiscalYear || !/^\d{4}$/.test(fiscalYear)) return null;
  const start = new Date(`${fiscalYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${Number(fiscalYear) + 1}-01-01T00:00:00.000Z`);
  return { gte: start, lt: end };
}

@Injectable()
export class BidNoticeService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.bidNotice.create({
      data: { ...payload, createBy: username },
    });
    return this.serialize(result);
  }

  async findAll(
    params: {
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      noticeTitle?: string;
      projectName?: string;
      flowStatus?: string;
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
      ...(dateWhere ? { publishDate: dateWhere } : {}),
      ...(params.noticeTitle ? { noticeTitle: { contains: params.noticeTitle } } : {}),
      ...(params.projectName ? { projectName: { contains: params.projectName } } : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.bidNotice.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.bidNotice.count({ where }),
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
    const result = await this.prisma.bidNotice.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async getHistory(id: bigint) {
    const record = await this.requireBidNotice(id);
    return this.financeWorkflowService.getHistory({ businessNo: this.getBusinessNo(record) });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireBidNotice(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前招标公告已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'bid-notice',
        currentNode: '申请节点',
        title: record.noticeTitle || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireBidNotice(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前招标公告未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'bid-notice',
        currentNode: '申请节点',
        title: record.noticeTitle || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.bidNotice.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.bidNotice.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any, requestContext: AppRequestContext) {
    return {
      bidDeadline: this.parseDate(data.bidDeadline),
      bidOpenDate: this.parseDate(data.bidOpenDate),
      flowStatus: data.flowStatus || '0',
      noticeContent: data.noticeContent || '',
      noticeTitle: data.noticeTitle || '',
      projectId: data.projectId ? BigInt(data.projectId) : undefined,
      projectName: data.projectName || '',
      publishDate: this.parseDate(data.publishDate, requestContext.fiscalYear),
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

  private getBusinessNo(record: { id: bigint }) {
    return `bid-notice-${record.id.toString()}`;
  }

  private async requireBidNotice(id: bigint) {
    const record = await this.prisma.bidNotice.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('招标公告不存在');
    }
    return record;
  }

  private serialize(item: any) {
    return { ...item, id: item.id.toString(), projectId: item.projectId?.toString() };
  }
}
