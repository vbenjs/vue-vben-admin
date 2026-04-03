import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SysDictService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async createData(data: any, username: string) {
    const { dictCode, key, ...createData } = data;
    const dictSort = createData.dictSort === undefined ? 0 : Number(createData.dictSort);
    const res = await this.prisma.sysDictData.create({
      data: { ...createData, dictSort, createBy: username },
    });
    await this.redis.del(`sys:dict:data:${res.dictType}`);
    return { ...res, dictCode: res.dictCode.toString() };
  }
  async createType(data: any, username: string) {
    const { dictId, key, ...createData } = data;
    const res = await this.prisma.sysDictType.create({
      data: { ...createData, createBy: username },
    });
    return { ...res, dictId: res.dictId.toString() };
  }

  async ensureFinanceBaseData(username: string) {
    const typeSeeds = [
      { dictName: '币种类型', dictType: 'currency_type', remark: '账套参数-币种' },
      { dictName: '凭证编号规则', dictType: 'voucher_rule', remark: '账套参数-凭证规则' },
      {
        dictName: '预算控制模式',
        dictType: 'budget_control_mode',
        remark: '账套参数-预算控制模式',
      },
      {
        dictName: '预算控制开关',
        dictType: 'budget_control_switch',
        remark: '组织参数-预算控制开关',
      },
      { dictName: '默认付款方式', dictType: 'payment_method_type', remark: '账套参数-付款方式' },
      { dictName: '单位性质', dictType: 'org_nature', remark: '账套参数-单位性质' },
      { dictName: '预算来源', dictType: 'fund_source_type', remark: '账套参数-预算来源' },
      {
        dictName: '辅助核算维度',
        dictType: 'aux_accounting_dimension',
        remark: '账套参数-辅助核算维度',
      },
    ];
    const dataSeeds = [
      {
        dictLabel: '人民币 CNY',
        dictType: 'currency_type',
        dictValue: 'CNY',
        dictSort: 1,
        listClass: 'success',
      },
      {
        dictLabel: '美元 USD',
        dictType: 'currency_type',
        dictValue: 'USD',
        dictSort: 2,
        listClass: 'default',
      },
      {
        dictLabel: '统一编号',
        dictType: 'voucher_rule',
        dictValue: '统一编号',
        dictSort: 1,
        listClass: 'primary',
      },
      {
        dictLabel: '按月编号',
        dictType: 'voucher_rule',
        dictValue: '按月编号',
        dictSort: 2,
        listClass: 'default',
      },
      {
        dictLabel: '严格控制',
        dictType: 'budget_control_mode',
        dictValue: '严格控制',
        dictSort: 1,
        listClass: 'danger',
      },
      {
        dictLabel: '预警控制',
        dictType: 'budget_control_mode',
        dictValue: '预警控制',
        dictSort: 2,
        listClass: 'warning',
      },
      {
        dictLabel: '不控制',
        dictType: 'budget_control_mode',
        dictValue: '不控制',
        dictSort: 3,
        listClass: 'default',
      },
      {
        dictLabel: '启用',
        dictType: 'budget_control_switch',
        dictValue: 'true',
        dictSort: 1,
        listClass: 'success',
      },
      {
        dictLabel: '禁用',
        dictType: 'budget_control_switch',
        dictValue: 'false',
        dictSort: 2,
        listClass: 'default',
      },
      {
        dictLabel: '银行转账',
        dictType: 'payment_method_type',
        dictValue: '银行转账',
        dictSort: 1,
        listClass: 'primary',
      },
      {
        dictLabel: '公务卡',
        dictType: 'payment_method_type',
        dictValue: '公务卡',
        dictSort: 2,
        listClass: 'success',
      },
      {
        dictLabel: '现金',
        dictType: 'payment_method_type',
        dictValue: '现金',
        dictSort: 3,
        listClass: 'warning',
      },
      {
        dictLabel: '事业单位',
        dictType: 'org_nature',
        dictValue: '事业单位',
        dictSort: 1,
        listClass: 'primary',
      },
      {
        dictLabel: '企业单位',
        dictType: 'org_nature',
        dictValue: '企业单位',
        dictSort: 2,
        listClass: 'default',
      },
      {
        dictLabel: '财政拨款',
        dictType: 'fund_source_type',
        dictValue: '财政拨款',
        dictSort: 1,
        listClass: 'success',
      },
      {
        dictLabel: '自有资金',
        dictType: 'fund_source_type',
        dictValue: '自有资金',
        dictSort: 2,
        listClass: 'default',
      },
      {
        dictLabel: '科研经费',
        dictType: 'fund_source_type',
        dictValue: '科研经费',
        dictSort: 3,
        listClass: 'warning',
      },
      {
        dictLabel: '部门',
        dictType: 'aux_accounting_dimension',
        dictValue: '部门',
        dictSort: 1,
        listClass: 'primary',
      },
      {
        dictLabel: '项目',
        dictType: 'aux_accounting_dimension',
        dictValue: '项目',
        dictSort: 2,
        listClass: 'success',
      },
      {
        dictLabel: '人员',
        dictType: 'aux_accounting_dimension',
        dictValue: '人员',
        dictSort: 3,
        listClass: 'default',
      },
    ];

    for (const item of typeSeeds) {
      await this.prisma.sysDictType.upsert({
        where: { dictType: item.dictType },
        create: { ...item, status: '0', createBy: username },
        update: { dictName: item.dictName, remark: item.remark, status: '0', updateBy: username },
      });
    }

    for (const item of dataSeeds) {
      const exists = await this.prisma.sysDictData.findFirst({
        where: { dictType: item.dictType, dictValue: item.dictValue },
      });
      if (exists) {
        await this.prisma.sysDictData.update({
          where: { dictCode: exists.dictCode },
          data: { ...item, status: '0', updateBy: username },
        });
      } else {
        await this.prisma.sysDictData.create({
          data: { ...item, status: '0', createBy: username },
        });
      }
      await this.redis.del(`sys:dict:data:${item.dictType}`);
    }
    return true;
  }

  // ==================== Dict Data ====================
  async getDataList(params: { dictLabel?: string; dictType?: string; status?: string }) {
    const { dictType, dictLabel, status } = params;
    const res = await this.prisma.sysDictData.findMany({
      where: {
        ...(dictType ? { dictType } : {}),
        ...(dictLabel ? { dictLabel: { contains: dictLabel } } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { dictSort: 'asc' },
    });
    return res.map((item) => ({ ...item, dictCode: item.dictCode.toString() }));
  }

  async getDictDataByType(dictType: string) {
    const cacheKey = `sys:dict:data:${dictType}`;

    // 1. 尝试从 Redis 缓存获取
    const cachedData = await this.redis.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // 2. 缓存未击中，查询数据库
    const data = await this.prisma.sysDictData.findMany({
      where: {
        dictType,
        status: '0', // 正常状态
      },
      orderBy: {
        dictSort: 'asc',
      },
      select: {
        dictLabel: true,
        dictValue: true,
        listClass: true,
      },
    });

    // 3. 写入缓存，设置较长的过期时间（如24小时）
    await this.redis.set(cacheKey, data, 86_400);

    return data;
  }

  // ==================== Dict Type ====================
  async getTypeList(params: { dictName?: string; dictType?: string; status?: string }) {
    const { dictName, dictType, status } = params;
    const res = await this.prisma.sysDictType.findMany({
      where: {
        ...(dictName ? { dictName: { contains: dictName } } : {}),
        ...(dictType ? { dictType: { contains: dictType } } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { dictId: 'asc' },
    });
    return res.map((item) => ({ ...item, dictId: item.dictId.toString() }));
  }

  async removeData(id: number | string) {
    const res = await this.prisma.sysDictData.delete({
      where: { dictCode: BigInt(id) },
    });
    await this.redis.del(`sys:dict:data:${res.dictType}`);
    return { ...res, dictCode: res.dictCode.toString() };
  }

  async removeType(id: number | string) {
    const res = await this.prisma.sysDictType.delete({
      where: { dictId: BigInt(id) },
    });
    return { ...res, dictId: res.dictId.toString() };
  }

  async updateData(id: number | string, data: any, username: string) {
    const { dictCode, key, title, value, children, ...updateData } = data;
    const dictSort = updateData.dictSort === undefined ? 0 : Number(updateData.dictSort);
    const res = await this.prisma.sysDictData.update({
      where: { dictCode: BigInt(id) },
      data: { ...updateData, dictSort, updateBy: username },
    });
    await this.redis.del(`sys:dict:data:${res.dictType}`);
    return { ...res, dictCode: res.dictCode.toString() };
  }

  async updateType(id: number | string, data: any, username: string) {
    const { dictId, key, title, value, children, ...updateData } = data;
    const res = await this.prisma.sysDictType.update({
      where: { dictId: BigInt(id) },
      data: { ...updateData, updateBy: username },
    });
    return { ...res, dictId: res.dictId.toString() };
  }
}
