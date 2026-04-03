import type { AppRequestContext } from '../common/request-context/request-context.types';

import { BadRequestException, Injectable } from '@nestjs/common';

import { FinanceWorkflowService } from '../finance-workflow/finance-workflow.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResearchProjectService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.researchProject.create({
      data: {
        ...payload,
        createBy: username,
      },
    });
    return this.serialize(result);
  }

  async findAll(
    params: {
      applyYear?: string;
      flowStatus?: string;
      page?: number;
      pageSize?: number;
      projectName?: string;
      projectStatus?: string;
      status?: string;
    },
    requestContext: AppRequestContext = {},
  ) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const applyYear = (params.applyYear || requestContext.fiscalYear || '').trim();

    const where = {
      ...(applyYear ? { applyYear } : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.projectName ? { projectName: { contains: params.projectName } } : {}),
      ...(params.projectStatus ? { projectStatus: params.projectStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.researchProject.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.researchProject.count({ where }),
    ]);

    return {
      context: {
        fiscalYear: applyYear,
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: items.map((item) => this.serialize(item)),
      total,
    };
  }

  async findOne(id: bigint) {
    const result = await this.prisma.researchProject.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async getHistory(id: bigint) {
    const record = await this.requireResearchProject(id);
    return this.financeWorkflowService.getHistory({
      businessNo: this.getBusinessNo(record),
    });
  }

  async remove(id: bigint) {
    const result = await this.prisma.researchProject.delete({ where: { id } });
    return this.serialize(result);
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireResearchProject(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前科研项目已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'research-project',
        currentNode: '申请节点',
        title: record.projectName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireResearchProject(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前科研项目未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'research-project',
        currentNode: '申请节点',
        title: record.projectName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.researchProject.update({
      where: { id },
      data: {
        ...payload,
        updateBy: username,
      },
    });
    return this.serialize(result);
  }

  private normalizePayload(data: any, requestContext: AppRequestContext) {
    const normalizedData = {
      applyYear: data.applyYear || requestContext.fiscalYear || '',
      deptName: data.deptName || '',
      funcCategory: data.funcCategory || '',
      fundSource: data.fundSource || '',
      flowStatus: data.flowStatus || '0',
      managerDeptName: data.managerDeptName || '',
      projectCode: data.projectCode || '',
      projectManager: data.projectManager || '',
      projectName: data.projectName || '',
      projectSource: data.projectSource || '',
      projectStatus: data.projectStatus || '0',
      projectType: data.projectType || '',
      remark: data.remark || '',
      status: data.status || '0',
    } as any;

    if (data.totalAmount !== undefined && data.totalAmount !== '') {
      normalizedData.totalAmount = data.totalAmount;
    }

    return normalizedData;
  }

  private getBusinessNo(record: { id: bigint; projectCode?: null | string }) {
    const projectCode = `${record.projectCode || ''}`.trim();
    return projectCode || `research-project-${record.id.toString()}`;
  }

  private async requireResearchProject(id: bigint) {
    const record = await this.prisma.researchProject.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('科研项目不存在');
    }
    return record;
  }

  private serialize(item: any) {
    return {
      ...item,
      deptId: item.deptId?.toString(),
      id: item.id.toString(),
      managerDeptId: item.managerDeptId?.toString(),
    };
  }
}
