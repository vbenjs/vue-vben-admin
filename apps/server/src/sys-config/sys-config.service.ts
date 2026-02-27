import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalConfig() {
    const configs = await this.prisma.sysParamConfig.findMany({
      select: { configKey: true, configValue: true },
    });

    const result: Record<string, string> = {};
    configs.forEach((item) => {
      if (item.configValue !== null) {
        result[item.configKey] = item.configValue;
      }
    });

    return result;
  }

  async saveConfig(configs: Record<string, string>) {
    // 过滤出并非 null 或 undefined 的有效值进行更新
    const updates = Object.keys(configs).map((key) => {
      return this.prisma.sysParamConfig.update({
        where: { configKey: key },
        data: { configValue: String(configs[key]) },
      });
    });
    
    // 我们在这里使用 Prisma 的事务进行批量更新
    await this.prisma.$transaction(updates);
    return true;
  }
}
