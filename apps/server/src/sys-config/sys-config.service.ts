import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysConfigService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeGroupPrefix(group: string) {
    const normalized = (group || '')
      .trim()
      .replace(/^sys\./, '')
      .replace(/\.$/, '');
    return normalized ? `sys.${normalized}.` : 'sys.';
  }

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

  async getConfigGroup(group: string) {
    const prefix = this.normalizeGroupPrefix(group);
    const configs = await this.prisma.sysParamConfig.findMany({
      where: { configKey: { startsWith: prefix } },
      orderBy: { configKey: 'asc' },
      select: { configKey: true, configValue: true },
    });

    const result: Record<string, string> = {};
    configs.forEach((item) => {
      if (item.configValue !== null) {
        result[item.configKey.slice(prefix.length)] = item.configValue;
      }
    });
    return result;
  }

  async saveConfig(configs: Record<string, string>) {
    // 不要求配置项必须预先存在，统一使用 upsert 保证首次保存也能成功
    const updates = Object.keys(configs).map((key) => {
      return this.prisma.sysParamConfig.upsert({
        where: { configKey: key },
        create: {
          configKey: key,
          configName: key,
          configValue: String(configs[key]),
        },
        update: { configValue: String(configs[key]) },
      });
    });

    await this.prisma.$transaction(updates);
    return true;
  }

  async saveConfigGroup(group: string, configs: Record<string, string>) {
    const prefix = this.normalizeGroupPrefix(group);
    const payload = Object.keys(configs).reduce<Record<string, string>>((acc, key) => {
      acc[`${prefix}${key}`] = String(configs[key]);
      return acc;
    }, {});
    return this.saveConfig(payload);
  }
}
