import type { config as SqlServerConfig } from 'mssql';

export interface LegacySqlConnectionSettings {
  connectionString: string;
  connectionTimeout: number;
  database: string;
  encrypt: boolean;
  enabled: boolean;
  host: string;
  password: string;
  poolIdleTimeoutMillis: number;
  poolMax: number;
  poolMin: number;
  port: number;
  requestTimeout: number;
  schema: string;
  trustServerCertificate: boolean;
  username: string;
}

function parseBoolean(value: string | undefined, defaultValue = false) {
  const normalized = `${value || ''}`.trim().toLowerCase();
  if (!normalized) {
    return defaultValue;
  }
  return ['1', 'on', 'true', 'yes'].includes(normalized);
}

function parseNumber(value: string | undefined, defaultValue: number) {
  const parsed = Number.parseInt(`${value || ''}`.trim(), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : defaultValue;
}

export function readLegacySqlConnectionSettings(
  env: NodeJS.ProcessEnv = process.env,
): LegacySqlConnectionSettings {
  return {
    connectionString: `${env.LEGACY_SQL_CONNECTION_STRING || ''}`.trim(),
    connectionTimeout: parseNumber(env.LEGACY_SQL_CONNECTION_TIMEOUT, 15_000),
    database: `${env.LEGACY_SQL_DATABASE || ''}`.trim(),
    enabled: parseBoolean(env.LEGACY_SQL_ENABLED, false),
    encrypt: parseBoolean(env.LEGACY_SQL_ENCRYPT, false),
    host: `${env.LEGACY_SQL_HOST || ''}`.trim(),
    password: `${env.LEGACY_SQL_PASSWORD || ''}`.trim(),
    poolIdleTimeoutMillis: parseNumber(env.LEGACY_SQL_POOL_IDLE_TIMEOUT, 30_000),
    poolMax: parseNumber(env.LEGACY_SQL_POOL_MAX, 10),
    poolMin: parseNumber(env.LEGACY_SQL_POOL_MIN, 0),
    port: parseNumber(env.LEGACY_SQL_PORT, 1433),
    requestTimeout: parseNumber(env.LEGACY_SQL_REQUEST_TIMEOUT, 30_000),
    schema: `${env.LEGACY_SQL_SCHEMA || 'dbo'}`.trim() || 'dbo',
    trustServerCertificate: parseBoolean(env.LEGACY_SQL_TRUST_SERVER_CERTIFICATE, true),
    username: `${env.LEGACY_SQL_USERNAME || ''}`.trim(),
  };
}

export function hasLegacySqlConnectionSettings(settings: LegacySqlConnectionSettings) {
  return !!settings.connectionString || !!(settings.host && settings.database);
}

export function createLegacySqlClientConfig(
  settings: LegacySqlConnectionSettings,
): SqlServerConfig | string {
  if (settings.connectionString) {
    return settings.connectionString;
  }

  return {
    connectionTimeout: settings.connectionTimeout,
    database: settings.database,
    options: {
      enableArithAbort: true,
      encrypt: settings.encrypt,
      trustServerCertificate: settings.trustServerCertificate,
    },
    password: settings.password || undefined,
    pool: {
      idleTimeoutMillis: settings.poolIdleTimeoutMillis,
      max: settings.poolMax,
      min: settings.poolMin,
    },
    port: settings.port,
    requestTimeout: settings.requestTimeout,
    server: settings.host,
    user: settings.username || undefined,
  };
}
