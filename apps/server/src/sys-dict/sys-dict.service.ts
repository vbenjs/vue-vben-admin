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
}
