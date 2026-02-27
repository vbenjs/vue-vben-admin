import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SysDictService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

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
    await this.redis.set(cacheKey, data, 86400);

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

  async createType(data: any, username: string) {
    const { dictId, key, ...createData } = data;
    const res = await this.prisma.sysDictType.create({
      data: { ...createData, createBy: username },
    });
    return { ...res, dictId: res.dictId.toString() };
  }

  async updateType(id: number | string, data: any, username: string) {
    const { dictId, key, ...updateData } = data;
    const res = await this.prisma.sysDictType.update({
      where: { dictId: BigInt(id) },
      data: { ...updateData, updateBy: username },
    });
    return { ...res, dictId: res.dictId.toString() };
  }

  async removeType(id: number | string) {
    const res = await this.prisma.sysDictType.delete({
      where: { dictId: BigInt(id) },
    });
    return { ...res, dictId: res.dictId.toString() };
  }

  // ==================== Dict Data ====================
  async getDataList(params: { dictType?: string; dictLabel?: string; status?: string }) {
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

  async createData(data: any, username: string) {
    const { dictCode, key, ...createData } = data;
    const dictSort = createData.dictSort !== undefined ? Number(createData.dictSort) : 0;
    const res = await this.prisma.sysDictData.create({
      data: { ...createData, dictSort, createBy: username },
    });
    await this.redis.del(`sys:dict:data:${res.dictType}`);
    return { ...res, dictCode: res.dictCode.toString() };
  }

  async updateData(id: number | string, data: any, username: string) {
    const { dictCode, key, ...updateData } = data;
    const dictSort = updateData.dictSort !== undefined ? Number(updateData.dictSort) : 0;
    const res = await this.prisma.sysDictData.update({
      where: { dictCode: BigInt(id) },
      data: { ...updateData, dictSort, updateBy: username },
    });
    await this.redis.del(`sys:dict:data:${res.dictType}`);
    return { ...res, dictCode: res.dictCode.toString() };
  }

  async removeData(id: number | string) {
    const res = await this.prisma.sysDictData.delete({
      where: { dictCode: BigInt(id) },
    });
    await this.redis.del(`sys:dict:data:${res.dictType}`);
    return { ...res, dictCode: res.dictCode.toString() };
  }

}
