import type { ConnectionPool } from 'mssql';

import { Injectable, OnModuleDestroy, ServiceUnavailableException } from '@nestjs/common';
import { ConnectionPool as SqlServerConnectionPool } from 'mssql';

import {
  createLegacySqlClientConfig,
  hasLegacySqlConnectionSettings,
  readLegacySqlConnectionSettings,
} from './legacy-sql.config';

@Injectable()
export class LegacySqlConnectionFactory implements OnModuleDestroy {
  private connectedPool?: ConnectionPool;
  private poolPromise?: Promise<ConnectionPool>;

  private readonly settings = readLegacySqlConnectionSettings();

  getSettings() {
    return this.settings;
  }

  isConfigured() {
    return hasLegacySqlConnectionSettings(this.settings);
  }

  isConnected() {
    return !!this.connectedPool?.connected;
  }

  async getPool() {
    if (!this.settings.enabled) {
      throw new ServiceUnavailableException('legacy-sql 连接已禁用');
    }

    if (!this.isConfigured()) {
      throw new ServiceUnavailableException('legacy-sql 连接参数未配置');
    }

    if (!this.poolPromise) {
      const pool = new SqlServerConnectionPool(createLegacySqlClientConfig(this.settings));
      this.poolPromise = pool
        .connect()
        .then((connectedPool) => {
          this.connectedPool = connectedPool;
          return connectedPool;
        })
        .catch((error) => {
          this.connectedPool = undefined;
          this.poolPromise = undefined;
          throw error;
        });
    }

    return this.poolPromise;
  }

  async ping() {
    const startedAt = Date.now();
    const pool = await this.getPool();
    const result = await pool.query<{ value: number }>('SELECT 1 AS value');
    return {
      connected: true,
      database: this.settings.database,
      driver: 'mssql' as const,
      elapsedMs: Date.now() - startedAt,
      host: this.settings.host || '(connection-string)',
      value: result.recordset[0]?.value ?? 1,
    };
  }

  async onModuleDestroy() {
    if (this.connectedPool) {
      await this.connectedPool.close().catch(() => undefined);
      this.connectedPool = undefined;
    } else if (this.poolPromise) {
      const pool = await this.poolPromise.catch(() => undefined);
      await pool?.close().catch(() => undefined);
    }

    this.poolPromise = undefined;
  }
}
