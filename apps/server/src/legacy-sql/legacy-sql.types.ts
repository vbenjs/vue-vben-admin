export type LegacySqlSourceType = 'stored-procedure' | 'table' | 'view';

export type LegacySqlContextKey = 'fiscalYear' | 'tenantId';

export interface LegacySqlNamedQueryDefinition {
  description: string;
  key: string;
  parameterKeys: string[];
  requiredContext: LegacySqlContextKey[];
  sourceName: string;
  sourceType: LegacySqlSourceType;
}

export interface LegacySqlStatus {
  connected: boolean;
  configured: boolean;
  connectionMode: 'connection-string' | 'discrete' | 'unconfigured';
  database: string;
  dialect: 'sqlserver';
  driver: 'mssql';
  enabled: boolean;
  hasConnectionString: boolean;
  hasPassword: boolean;
  hasUsername: boolean;
  host: string;
  namedQueryCount: number;
  port: number;
  schema: string;
}

export interface LegacySqlPingResult {
  connected: boolean;
  database: string;
  driver: 'mssql';
  elapsedMs: number;
  host: string;
  value: number;
}

export interface LegacySqlQueryExecutionResult {
  items: Record<string, unknown>[];
  page: number;
  pageSize: number;
  queryKey: string;
  sourceName: string;
  sourceType: LegacySqlSourceType;
  total: number;
}
