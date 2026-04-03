import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Int, NVarChar } from 'mssql';

import type {
  LegacySqlNamedQueryDefinition,
  LegacySqlQueryExecutionResult,
  LegacySqlPingResult,
  LegacySqlStatus,
} from './legacy-sql.types';
import { LegacySqlConnectionFactory } from './legacy-sql.connection-factory';

const LEGACY_SQL_NAMED_QUERIES: LegacySqlNamedQueryDefinition[] = [
  {
    description: '报销单主表查询',
    key: 'reimbursement-list',
    parameterKeys: ['billNo', 'keyword', 'status'],
    requiredContext: ['fiscalYear', 'tenantId'],
    sourceName: 'GFM_REI_PAY',
    sourceType: 'table',
  },
  {
    description: '报销单明细查询',
    key: 'reimbursement-detail',
    parameterKeys: ['billNo'],
    requiredContext: ['tenantId'],
    sourceName: 'GFM_REI_PAY_DETAIL',
    sourceType: 'table',
  },
  {
    description: '支付单据查询',
    key: 'payment-list',
    parameterKeys: ['billNo', 'keyword', 'status'],
    requiredContext: ['fiscalYear', 'tenantId'],
    sourceName: 'VW_GFM_PAY',
    sourceType: 'view',
  },
  {
    description: '支付单据票据明细查询',
    key: 'payment-bill-list',
    parameterKeys: ['billNo'],
    requiredContext: ['tenantId'],
    sourceName: 'VW_GFM_PAY_BILL',
    sourceType: 'view',
  },
  {
    description: '指标余额查询',
    key: 'account-balance-list',
    parameterKeys: ['indicatorCode', 'keyword'],
    requiredContext: ['fiscalYear', 'tenantId'],
    sourceName: 'VW_ACC_BALANCE',
    sourceType: 'view',
  },
  {
    description: '待办流程列表查询',
    key: 'todo-list',
    parameterKeys: ['queryType', 'userId'],
    requiredContext: ['fiscalYear', 'tenantId'],
    sourceName: 'proc_todolist',
    sourceType: 'stored-procedure',
  },
];

@Injectable()
export class LegacySqlService {
  constructor(private readonly legacySqlConnectionFactory: LegacySqlConnectionFactory) {}

  getStatus(): LegacySqlStatus {
    const settings = this.legacySqlConnectionFactory.getSettings();
    const connectionString = settings.connectionString;
    const host = settings.host;
    const database = settings.database;
    const schema = settings.schema;
    const username = settings.username;
    const password = settings.password;
    const port = settings.port;
    const hasConnectionString = connectionString.length > 0;
    const hasDiscreteConfig = !!host && !!database;

    return {
      connected: this.legacySqlConnectionFactory.isConnected(),
      configured: hasConnectionString || hasDiscreteConfig,
      connectionMode: hasConnectionString
        ? 'connection-string'
        : hasDiscreteConfig
          ? 'discrete'
          : 'unconfigured',
      database,
      dialect: 'sqlserver',
      driver: 'mssql',
      enabled: settings.enabled,
      hasConnectionString,
      hasPassword: password.length > 0,
      hasUsername: username.length > 0,
      host,
      namedQueryCount: LEGACY_SQL_NAMED_QUERIES.length,
      port,
      schema,
    };
  }

  listNamedQueries(): LegacySqlNamedQueryDefinition[] {
    return LEGACY_SQL_NAMED_QUERIES;
  }

  getNamedQuery(key: string): LegacySqlNamedQueryDefinition {
    const namedQuery = LEGACY_SQL_NAMED_QUERIES.find((item) => item.key === key);
    if (!namedQuery) {
      throw new NotFoundException(`未找到 legacy-sql 命名查询：${key}`);
    }
    return namedQuery;
  }

  ping(): Promise<LegacySqlPingResult> {
    return this.legacySqlConnectionFactory.ping();
  }

  async executeNamedQuery(
    key: string,
    params: {
      billNo?: string;
      fiscalYear?: number | string;
      flowNo?: string;
      indicatorCode?: string;
      keyword?: string;
      page?: number | string;
      pageSize?: number | string;
      queryType?: string;
      status?: string;
      tenantId?: number | string;
      userId?: number | string;
    } = {},
  ): Promise<LegacySqlQueryExecutionResult> {
    const namedQuery = this.getNamedQuery(key);
    if (namedQuery.sourceType === 'stored-procedure') {
      return this.executeStoredProcedureNamedQuery(namedQuery, params);
    }

    const page = this.normalizePositiveInteger(params.page, 1);
    const pageSize = this.normalizePositiveInteger(params.pageSize, 20, 200);
    if (this.hasTableOrViewFilters(params)) {
      return this.executeFilteredTableOrViewNamedQuery(namedQuery, params, page, pageSize);
    }
    const startRow = (page - 1) * pageSize + 1;
    const endRow = page * pageSize;
    const schema = this.escapeIdentifier(this.legacySqlConnectionFactory.getSettings().schema);
    const sourceName = this.escapeIdentifier(namedQuery.sourceName);
    const qualifiedSourceName = `[${schema}].[${sourceName}]`;
    const pool = await this.legacySqlConnectionFactory.getPool();
    const result = await pool
      .request()
      .input('startRow', Int, startRow)
      .input('endRow', Int, endRow).query(`
        SELECT *
        FROM (
          SELECT ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS __row_num, *
          FROM ${qualifiedSourceName}
        ) AS source_rows
        WHERE source_rows.__row_num BETWEEN @startRow AND @endRow
        ORDER BY source_rows.__row_num;

        SELECT COUNT(1) AS total
        FROM ${qualifiedSourceName};
      `);

    return {
      items: (result.recordsets[0] || []).map((item) => {
        const normalizedItem = { ...item };
        delete normalizedItem.__row_num;
        return normalizedItem;
      }),
      page,
      pageSize,
      queryKey: namedQuery.key,
      sourceName: namedQuery.sourceName,
      sourceType: namedQuery.sourceType,
      total: Number(result.recordsets[1]?.[0]?.total || 0),
    };
  }

  private escapeIdentifier(value: string) {
    return value.replaceAll(']', ']]');
  }

  private async executeStoredProcedureNamedQuery(
    namedQuery: LegacySqlNamedQueryDefinition,
    params: {
      fiscalYear?: number | string;
      billNo?: string;
      flowNo?: string;
      indicatorCode?: string;
      keyword?: string;
      page?: number | string;
      pageSize?: number | string;
      queryType?: string;
      status?: string;
      tenantId?: number | string;
      userId?: number | string;
    },
  ): Promise<LegacySqlQueryExecutionResult> {
    if (namedQuery.key !== 'todo-list') {
      throw new BadRequestException(`命名查询 ${namedQuery.key} 暂未配置存储过程参数映射`);
    }

    const page = this.normalizePositiveInteger(params.page, 1);
    const pageSize = this.normalizePositiveInteger(params.pageSize, 20, 200);
    const queryType = `${params.queryType || ''}`.trim();
    const userId = `${params.userId || ''}`.trim();
    const fiscalYear = `${params.fiscalYear || ''}`.trim();
    const keyword = `${params.keyword || ''}`.trim().toLowerCase();
    const flowNo = `${params.flowNo || ''}`.trim().toLowerCase();
    const status = `${params.status || ''}`.trim();
    const tenantId = this.normalizeOptionalInteger(params.tenantId);

    if (!queryType) {
      throw new BadRequestException('todo-list 缺少 queryType 参数');
    }

    if (!userId) {
      throw new BadRequestException('todo-list 缺少 userId 参数');
    }

    const pool = await this.legacySqlConnectionFactory.getPool();
    const request = pool
      .request()
      .input('queryType', NVarChar(50), queryType)
      .input('userId', NVarChar(50), userId);

    if (fiscalYear) {
      request.input('fiscalYear', NVarChar(10), fiscalYear);
    }

    if (tenantId !== undefined) {
      request.input('tenantId', Int, tenantId);
    }

    const result = await request.execute(namedQuery.sourceName);
    const items = (result.recordset || result.recordsets[0] || []).map((item) => ({
      ...item,
    }));
    const filteredItems = items.filter((item) =>
      this.matchesTodoListFilters(item, { flowNo, keyword, status }),
    );
    const total = this.extractRecordsetTotal(
      this.normalizeRecordsets(result.recordsets),
      filteredItems.length,
    );
    const startIndex = (page - 1) * pageSize;

    return {
      items: filteredItems.slice(startIndex, startIndex + pageSize),
      page,
      pageSize,
      queryKey: namedQuery.key,
      sourceName: namedQuery.sourceName,
      sourceType: namedQuery.sourceType,
      total,
    };
  }

  private async executeFilteredTableOrViewNamedQuery(
    namedQuery: LegacySqlNamedQueryDefinition,
    params: {
      billNo?: string;
      fiscalYear?: number | string;
      flowNo?: string;
      indicatorCode?: string;
      keyword?: string;
      page?: number | string;
      pageSize?: number | string;
      queryType?: string;
      status?: string;
      tenantId?: number | string;
      userId?: number | string;
    },
    page: number,
    pageSize: number,
  ): Promise<LegacySqlQueryExecutionResult> {
    const schema = this.escapeIdentifier(this.legacySqlConnectionFactory.getSettings().schema);
    const sourceName = this.escapeIdentifier(namedQuery.sourceName);
    const qualifiedSourceName = `[${schema}].[${sourceName}]`;
    const pool = await this.legacySqlConnectionFactory.getPool();
    const result = await pool.request().query(`SELECT * FROM ${qualifiedSourceName};`);
    const items = (result.recordset || result.recordsets[0] || []).map((item) => ({
      ...item,
    }));
    const filteredItems = items.filter((item) =>
      this.matchesFinanceFilters(namedQuery, item, {
        billNo: `${params.billNo || ''}`.trim().toLowerCase(),
        indicatorCode: `${params.indicatorCode || ''}`.trim().toLowerCase(),
        keyword: `${params.keyword || ''}`.trim().toLowerCase(),
        status: `${params.status || ''}`.trim(),
      }),
    );
    const startIndex = (page - 1) * pageSize;

    return {
      items: filteredItems.slice(startIndex, startIndex + pageSize),
      page,
      pageSize,
      queryKey: namedQuery.key,
      sourceName: namedQuery.sourceName,
      sourceType: namedQuery.sourceType,
      total: filteredItems.length,
    };
  }

  private extractRecordsetTotal(recordsets: Array<Record<string, unknown>[]>, fallback: number) {
    for (const recordset of recordsets.slice(1)) {
      const row = recordset?.[0];
      if (!row) {
        continue;
      }

      const totalValue = row.total ?? row.Total ?? row.count ?? row.Count ?? row.COUNT;
      if (typeof totalValue === 'number') {
        return totalValue;
      }
      if (typeof totalValue === 'bigint') {
        return Number(totalValue);
      }
      if (typeof totalValue === 'string' && totalValue.trim()) {
        const parsed = Number.parseInt(totalValue, 10);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return fallback;
  }

  private normalizeRecordsets(
    recordsets: Array<Record<string, unknown>[]> | Record<string, Record<string, unknown>[]>,
  ) {
    return Array.isArray(recordsets) ? recordsets : Object.values(recordsets);
  }

  private matchesTodoListFilters(
    item: Record<string, unknown>,
    filters: { flowNo: string; keyword: string; status: string },
  ) {
    const title = this.pickFirstString(item, [
      'applyTitle',
      'title',
      'flowTitle',
      'billTitle',
      'billName',
      'subject',
    ]).toLowerCase();
    const flowNo = this.pickFirstString(item, [
      'flowNo',
      'flow_no',
      'billNo',
      'bill_no',
      'processNo',
    ]).toLowerCase();
    const status = this.pickFirstString(item, [
      'status',
      'flowStatus',
      'flow_status',
      'approveStatus',
    ]);

    if (filters.keyword && !title.includes(filters.keyword)) {
      return false;
    }

    if (filters.flowNo && !flowNo.includes(filters.flowNo)) {
      return false;
    }

    if (filters.status && status !== filters.status) {
      return false;
    }

    return true;
  }

  private matchesFinanceFilters(
    namedQuery: LegacySqlNamedQueryDefinition,
    item: Record<string, unknown>,
    filters: { billNo: string; indicatorCode: string; keyword: string; status: string },
  ) {
    const billNo = this.pickFirstString(item, [
      'billNo',
      'bill_no',
      'flowNo',
      'voucherNo',
      'docNo',
    ]).toLowerCase();
    const indicatorCode = this.pickFirstString(item, [
      'indicatorCode',
      'indicator_code',
      'zbCode',
      'quotaCode',
    ]).toLowerCase();
    const status = this.pickFirstString(item, [
      'status',
      'billStatus',
      'flowStatus',
      'voucherStatus',
    ]);
    const keywordValue = this.pickFirstString(
      item,
      this.getFinanceKeywordKeys(namedQuery),
    ).toLowerCase();

    if (filters.billNo && !billNo.includes(filters.billNo)) {
      return false;
    }

    if (filters.indicatorCode && !indicatorCode.includes(filters.indicatorCode)) {
      return false;
    }

    if (filters.keyword && !keywordValue.includes(filters.keyword)) {
      return false;
    }

    if (filters.status && status !== filters.status) {
      return false;
    }

    return true;
  }

  private getFinanceKeywordKeys(namedQuery: LegacySqlNamedQueryDefinition) {
    if (namedQuery.key === 'account-balance-list') {
      return ['indicatorName', 'indicator_name', 'deptName', 'voucherNo', 'voucherStatus'];
    }

    if (namedQuery.key === 'payment-list') {
      return ['title', 'billTitle', 'subject', 'summary', 'remark', 'payerName', 'applyUserName'];
    }

    return ['title', 'billTitle', 'subject', 'summary', 'remark', 'applyUser', 'applyUserName'];
  }

  private hasTableOrViewFilters(params: {
    billNo?: string;
    indicatorCode?: string;
    keyword?: string;
    status?: string;
  }) {
    return !!(
      `${params.billNo || ''}`.trim() ||
      `${params.indicatorCode || ''}`.trim() ||
      `${params.keyword || ''}`.trim() ||
      `${params.status || ''}`.trim()
    );
  }

  private pickFirstString(item: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
      const value = item[key];
      if (value === undefined || value === null) {
        continue;
      }
      let normalized = '';
      if (typeof value === 'string') {
        normalized = value.trim();
      } else if (
        typeof value === 'bigint' ||
        typeof value === 'boolean' ||
        typeof value === 'number'
      ) {
        normalized = String(value).trim();
      }
      if (normalized) {
        return normalized;
      }
    }
    return '';
  }

  private normalizeOptionalInteger(value: number | string | undefined) {
    const normalized = `${value || ''}`.trim();
    if (!normalized) {
      return undefined;
    }
    const parsed = Number.parseInt(normalized, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  }

  private normalizePositiveInteger(
    value: number | string | undefined,
    defaultValue: number,
    maxValue = Number.MAX_SAFE_INTEGER,
  ) {
    const parsed = Number.parseInt(`${value || ''}`.trim(), 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return defaultValue;
    }
    return Math.min(parsed, maxValue);
  }
}
