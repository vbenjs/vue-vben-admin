import { BadRequestException, Injectable } from '@nestjs/common';

import { FinanceWorkflowService } from '../finance-workflow/finance-workflow.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthAdjustApplyService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string) {
    return this.serialize(
      await this.prisma.authAdjustApply.create({
        data: { ...this.normalizePayload(data), createBy: username },
      }),
    );
  }

  async findAll(params: {
    applyDeptName?: string;
    flowStatus?: string;
    indicatorName?: string;
    page?: number;
    pageSize?: number;
    status?: string;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const where = {
      ...(params.indicatorName
        ? { indicatorName: { contains: params.indicatorName } }
        : {}),
      ...(params.applyDeptName
        ? { applyDeptName: { contains: params.applyDeptName } }
        : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.authAdjustApply.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.authAdjustApply.count({ where }),
    ]);
    return { items: items.map((i) => this.serialize(i)), total };
  }

  async findOne(id: bigint) {
    const r = await this.prisma.authAdjustApply.findUnique({ where: { id } });
    return r ? this.serialize(r) : null;
  }

  async update(id: bigint, data: any, username: string) {
    return this.serialize(
      await this.prisma.authAdjustApply.update({
        where: { id },
        data: { ...this.normalizePayload(data), updateBy: username },
      }),
    );
  }

  async remove(id: bigint) {
    return this.serialize(await this.prisma.authAdjustApply.delete({ where: { id } }));
  }

  async getHistory(id: bigint) {
    const record = await this.requireAuthAdjustApply(id);
    return this.financeWorkflowService.getHistory({
      businessNo: this.getBusinessNo(record),
    });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireAuthAdjustApply(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前授权调整申请已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'auth-adjust-apply',
        currentNode: '申请节点',
        title: record.indicatorName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async withdraw(
    id: bigint,
    actor: { realName?: string; userId?: string; username?: string },
  ) {
    const record = await this.requireAuthAdjustApply(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前授权调整申请未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'auth-adjust-apply',
        currentNode: '申请节点',
        title: record.indicatorName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  private normalizePayload(data: any) {
    return {
      applyAmount: data.applyAmount ?? 0,
      applyDate: data.applyDate ? new Date(data.applyDate) : undefined,
      applyDeptId: data.applyDeptId ? BigInt(data.applyDeptId) : undefined,
      applyDeptName: data.applyDeptName || '',
      applyNo: data.applyNo || '',
      flowStatus: data.flowStatus || '0',
      fundUsage: data.fundUsage || '',
      indicatorAmount: data.indicatorAmount ?? 0,
      indicatorId: data.indicatorId ? BigInt(data.indicatorId) : undefined,
      indicatorName: data.indicatorName || '',
      operatorName: data.operatorName || '',
      preciseAmount: data.preciseAmount ?? 0,
      remark: data.remark || '',
      status: data.status || '0',
    } as any;
  }

  private getBusinessNo(record: { applyNo?: null | string; id: bigint }) {
    const applyNo = `${record.applyNo || ''}`.trim();
    return applyNo || `auth-adjust-apply-${record.id.toString()}`;
  }

  private async requireAuthAdjustApply(id: bigint) {
    const record = await this.prisma.authAdjustApply.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('授权调整申请不存在');
    }
    return record;
  }

  private serialize(item: any) {
    return {
      ...item,
      applyDeptId: item.applyDeptId?.toString(),
      id: item.id.toString(),
      indicatorId: item.indicatorId?.toString(),
    };
  }
}
