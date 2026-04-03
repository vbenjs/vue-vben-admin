import * as fs from 'node:fs';
import * as path from 'node:path';

import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysGenService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteTables(tableIds: string[]) {
    for (const idStr of tableIds) {
      await this.prisma.sysGenTable.delete({ where: { tableId: BigInt(idStr) } });
    }
    return { success: true };
  }

  /** 一键写入代码文件到本地工程目录 */
  async executeCodeGeneration(tableIdStr: string) {
    const templates = await this.getCodeTemplates(tableIdStr);
    const { info, moduleCode, controllerCode, serviceCode, vueCode } = templates;

    const mod = info.moduleName || 'biz';
    const biz = info.businessName || 'demo';

    const backendModDir = path.join(process.cwd(), 'src', `${mod}-${biz}`);
    if (!fs.existsSync(backendModDir)) {
      fs.mkdirSync(backendModDir, { recursive: true });
    }

    const tsBusiness = `${mod}-${biz}`;
    fs.writeFileSync(path.join(backendModDir, `${tsBusiness}.module.ts`), moduleCode);
    fs.writeFileSync(path.join(backendModDir, `${tsBusiness}.controller.ts`), controllerCode);
    fs.writeFileSync(path.join(backendModDir, `${tsBusiness}.service.ts`), serviceCode);

    // Create Vue File
    const frontendDir = path.join(process.cwd(), '..', 'web-antd', 'src', 'views', mod, biz);
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    fs.writeFileSync(path.join(frontendDir, 'index.vue'), vueCode);

    return {
      success: true,
      message:
        '代码已成功生成到项目目录下。注意：后端模块需要在 app.module.ts 中注册，前端路由需要在 roles/router 中配置。',
    };
  }

  async findAll(params: { skip: number; tableName?: string; take: number }) {
    const { skip, take, tableName } = params;
    const where = tableName ? { tableName: { contains: tableName } } : {};
    const items = await this.prisma.sysGenTable.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });
    const total = await this.prisma.sysGenTable.count({ where });

    return { items: items.map((item) => ({ ...item, tableId: item.tableId.toString() })), total };
  }

  /** 获取生成代码映射 */
  async getCodeTemplates(tableIdStr: string) {
    const { info, rows } = await this.getTableDetail(tableIdStr);
    const pascalName = info.className || 'Entity';
    const modelName = this.toCamelCase(info.tableName, false); // For prisma calls
    const pkColumn = rows.find((r) => r.isPk === '1') || rows[0];
    const pkType = pkColumn.tsType === 'number' ? 'number' : 'string';

    // ================= NestJS 代码片段 =================
    const controllerCode = `
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { ${pascalName}Service } from './${info.moduleName}-${info.businessName}.service';

@Controller('${info.moduleName}/${info.businessName}')
export class ${pascalName}Controller {
  constructor(private readonly service: ${pascalName}Service) {}

  @Get('list')
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(${pkType === 'number' ? 'Number(id)' : 'id'});
  }

  @Post()
  async create(@Body() createData: any, @Request() req) {
    const username = req.user?.username || 'admin';
    return this.service.create(createData, username);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    const username = req.user?.username || 'admin';
    return this.service.update(${pkType === 'number' ? 'Number(id)' : 'id'}, updateData, username);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(${pkType === 'number' ? 'Number(id)' : 'id'});
  }
}
`.trim();

    const serviceCode = `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ${pascalName}Service {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: any) {
    const where: any = {};
${rows
  .filter((r) => r.isQuery === '1')
  .map((r) => {
    if (r.queryType === 'LIKE')
      return `    if (params.${r.tsField}) where.${r.tsField} = { contains: params.${r.tsField} };`;
    return `    if (params.${r.tsField}) where.${r.tsField} = params.${r.tsField};`;
  })
  .join(String.raw`\n`)}
    return this.prisma.${modelName}.findMany({ where, orderBy: { createTime: 'desc' } });
  }

  async findOne(id: ${pkType}) {
    return this.prisma.${modelName}.findUnique({ where: { ${pkColumn.tsField}: id } });
  }

  async create(data: any, username: string) {
    return this.prisma.${modelName}.create({
      data: {
        ...data,
        createBy: username,
      },
    });
  }

  async update(id: ${pkType}, data: any, username: string) {
    return this.prisma.${modelName}.update({
      where: { ${pkColumn.tsField}: id },
      data: {
        ...data,
        updateBy: username,
      },
    });
  }

  async remove(id: ${pkType}) {
    return this.prisma.${modelName}.delete({ where: { ${pkColumn.tsField}: id } });
  }
}
`.trim();

    const moduleCode = `
import { Module } from '@nestjs/common';
import { ${pascalName}Service } from './${info.moduleName}-${info.businessName}.service';
import { ${pascalName}Controller } from './${info.moduleName}-${info.businessName}.controller';

@Module({
  controllers: [${pascalName}Controller],
  providers: [${pascalName}Service],
})
export class ${pascalName}Module {}
`.trim();

    // ================= Vue Vben 代码片段 =================

    // 生成表单 Schema
    // 生成表格 Columns
    const gridColumns = rows
      .filter((r) => r.isList === '1')
      .map((r) => {
        return `    { title: '${r.columnComment || r.tsField}', field: '${r.tsField}' },`;
      })
      .join(String.raw`\n`);

    // 生成查询 Schema
    const queryItems = rows
      .filter((r) => r.isQuery === '1')
      .map((r) => {
        let component = 'Input';
        if (r.htmlType === 'select') component = 'Select';
        return `    { fieldName: '${r.tsField}', label: '${r.columnComment || r.tsField}', component: '${component}' },`;
      })
      .join(String.raw`\n`);

    const vueCode = `
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';
import { message, Modal } from 'ant-design-vue';

// APIs
const api = {
  getList: (params?: any) => requestClient.get('/${info.moduleName}/${info.businessName}/list', { params }),
  create: (data: any) => requestClient.post('/${info.moduleName}/${info.businessName}', data),
  update: (id: string | number, data: any) => requestClient.put(\`/\${'${info.moduleName}'}/\${'${info.businessName}'}/\${id}\`, data),
  remove: (id: string | number) => requestClient.delete(\`/\${'${info.moduleName}'}/\${'${info.businessName}'}/\${id}\`),
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    items: [
${queryItems}
    ],
  },
  gridOptions: {
    columns: [
${gridColumns}
      { title: '操作', field: 'action', slots: { default: 'action' }, width: 150, fixed: 'right' },
    ],
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const res = await api.getList({ page: page.currentPage, pageSize: page.pageSize, ...formValues });
          // Vben expect { items, total } from backend, please map appropriately if needed.
          return res;
        },
      },
    },
  },
});

// Add Modal Template Logic Here if needed
// (Generated simplified without Modal definition for preview brevity)
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <a-button type="primary">新增</a-button>
      </template>
      <template #action="{ row }">
        <a-button type="link" size="small">编辑</a-button>
        <a-button type="link" size="small" danger>删除</a-button>
      </template>
    </Grid>
  </Page>
</template>
`.trim();

    return {
      info,
      pascalName,
      moduleCode,
      controllerCode,
      serviceCode,
      vueCode,
    };
  }

  /** 查询某表的列信息 */
  async getDbColumns(tableName: string) {
    const sqlUrl = `
      SELECT column_name AS columnName, data_type AS dataType, column_comment AS columnComment, 
             column_key AS columnKey, extra AS extra, is_nullable AS isNullable
      FROM information_schema.columns 
      WHERE table_schema = (SELECT DATABASE()) AND table_name = '${tableName}'
      ORDER BY ordinal_position ASC
    `;
    const result: any[] = await this.prisma.$queryRawUnsafe(sqlUrl);
    return result;
  }

  /** 查询数据库所有表 */
  async getDbTables(tableName?: string, tableComment?: string) {
    let sqlUrl = `SELECT table_name AS tableName, table_comment AS tableComment, create_time AS createTime, update_time AS updateTime
                  FROM information_schema.tables 
                  WHERE table_schema = (SELECT DATABASE())`;
    if (tableName) sqlUrl += ` AND table_name LIKE '%${tableName}%'`;
    if (tableComment) sqlUrl += ` AND table_comment LIKE '%${tableComment}%'`;
    sqlUrl += ` AND table_name NOT IN (SELECT table_name FROM sys_gen_table)`;
    sqlUrl += ` ORDER BY create_time DESC`;

    const result: any[] = await this.prisma.$queryRawUnsafe(sqlUrl);
    return { items: result, total: result.length };
  }

  async getTableDetail(tableIdStr: string) {
    const tableId = BigInt(tableIdStr);
    const tableInfo = await this.prisma.sysGenTable.findUnique({ where: { tableId } });
    if (!tableInfo) throw new BadRequestException('记录不存在');

    const columns = await this.prisma.sysGenColumn.findMany({
      where: { tableId },
      orderBy: { sort: 'asc' },
    });
    return {
      info: { ...tableInfo, tableId: tableInfo.tableId.toString() },
      rows: columns.map((col) => ({
        ...col,
        columnId: col.columnId.toString(),
        tableId: col.tableId.toString(),
      })),
    };
  }

  /** 将 db 表导入系统生成配置 */
  async importTables(tables: string[], username: string) {
    if (!tables || tables.length === 0) throw new BadRequestException('请选择要导入的表');

    for (const tableName of tables) {
      const tblList: any[] = await this.prisma.$queryRawUnsafe(`
        SELECT table_name AS tableName, table_comment AS tableComment 
        FROM information_schema.tables 
        WHERE table_schema = (SELECT DATABASE()) AND table_name = '${tableName}'
      `);
      if (!tblList || tblList.length === 0) continue;

      const tbl = tblList[0];
      const className = this.toCamelCase(tableName, true);
      const businessName = this.toCamelCase(tableName.replace('sys_', ''), false);
      const moduleName = tableName.startsWith('sys_') ? 'sys' : 'biz';

      const genTable = await this.prisma.sysGenTable.create({
        data: {
          tableName: tbl.tableName,
          tableComment: tbl.tableComment || '',
          className,
          packageName: 'com.vben.admin',
          moduleName,
          businessName,
          functionName: tbl.tableComment || className,
          functionAuthor: username,
          createBy: username,
        },
      });

      const dbCols = await this.getDbColumns(tableName);
      let sort = 1;
      for (const col of dbCols) {
        let tsType = 'string';
        if (
          [
            'bigint',
            'decimal',
            'double',
            'float',
            'int',
            'integer',
            'smallint',
            'tinyint',
          ].includes(col.dataType.toLowerCase())
        )
          tsType = 'number';
        if (['date', 'datetime', 'timestamp'].includes(col.dataType.toLowerCase())) tsType = 'Date';
        if (
          ['bit', 'tinyint'].includes(col.dataType.toLowerCase()) &&
          col.columnName.includes('is_')
        )
          tsType = 'boolean';

        const tsField = this.toCamelCase(col.columnName, false);
        const isPk = col.columnKey === 'PRI' ? '1' : '0';
        const isIncrement = col.extra?.includes('auto_increment') ? '1' : '0';
        const isRequired = col.isNullable === 'NO' && !col.extra ? '1' : '0';

        let htmlType = 'input';
        if (tsType === 'number') htmlType = 'inputNumber';
        if (tsType === 'boolean') htmlType = 'switch';
        if (tsType === 'Date') htmlType = 'datetime';
        if (tsField.includes('status') || tsField.includes('type')) htmlType = 'select';
        if (tsField.includes('remark') || tsField.includes('content')) htmlType = 'textarea';

        await this.prisma.sysGenColumn.create({
          data: {
            tableId: genTable.tableId,
            columnName: col.columnName,
            columnComment: col.columnComment || '',
            columnType: col.dataType,
            tsType,
            tsField,
            isPk,
            isIncrement,
            isRequired,
            isInsert: isPk === '1' ? '0' : '1',
            isEdit: isPk === '1' ? '0' : '1',
            isList: '1',
            isQuery: '0',
            queryType: 'EQ',
            htmlType,
            sort: sort++,
            createBy: username,
          },
        });
      }
    }
  }

  /** 预览生成的代码 */
  async previewCode(tableIdStr: string) {
    return this.getCodeTemplates(tableIdStr);
  }

  async syncTable(tableIdStr: string, username: string) {
    const tableId = BigInt(tableIdStr);
    const tableInfo = await this.prisma.sysGenTable.findUnique({ where: { tableId } });
    if (!tableInfo) return;

    const dbCols = await this.getDbColumns(tableInfo.tableName);
    const genCols = await this.prisma.sysGenColumn.findMany({ where: { tableId } });
    const genColNames = new Set(genCols.map((c) => c.columnName));
    let nextSort = genCols.length > 0 ? Math.max(...genCols.map((c) => c.sort || 0)) + 1 : 1;

    for (const col of dbCols) {
      if (!genColNames.has(col.columnName)) {
        let tsType = 'string';
        if (
          [
            'bigint',
            'decimal',
            'double',
            'float',
            'int',
            'integer',
            'smallint',
            'tinyint',
          ].includes(col.dataType.toLowerCase())
        )
          tsType = 'number';
        if (['date', 'datetime', 'timestamp'].includes(col.dataType.toLowerCase())) tsType = 'Date';
        if (['tinyint'].includes(col.dataType.toLowerCase()) && col.columnName.includes('is_'))
          tsType = 'boolean';

        const tsField = this.toCamelCase(col.columnName, false);
        await this.prisma.sysGenColumn.create({
          data: {
            tableId,
            columnName: col.columnName,
            columnComment: col.columnComment || '',
            columnType: col.dataType,
            tsType,
            tsField,
            isPk: col.columnKey === 'PRI' ? '1' : '0',
            isIncrement: col.extra?.includes('auto_increment') ? '1' : '0',
            isRequired: col.isNullable === 'NO' && !col.extra ? '1' : '0',
            isInsert: col.columnKey === 'PRI' ? '0' : '1',
            isEdit: col.columnKey === 'PRI' ? '0' : '1',
            isList: '1',
            isQuery: '0',
            queryType: 'EQ',
            htmlType: tsType === 'number' ? 'inputNumber' : 'input',
            sort: nextSort++,
            createBy: username,
          },
        });
      }
    }
    return { success: true };
  }

  async updateConfig(updateData: any, username: string) {
    const { info, rows } = updateData;
    if (!info || !info.tableId) throw new BadRequestException('参数异常');

    const tableId = BigInt(info.tableId);

    await this.prisma.sysGenTable.update({
      where: { tableId },
      data: {
        tableName: info.tableName,
        tableComment: info.tableComment,
        className: info.className,
        moduleName: info.moduleName,
        businessName: info.businessName,
        functionAuthor: info.functionAuthor,
        genType: info.genType || '0',
        updateBy: username,
      },
    });

    if (rows && Array.isArray(rows)) {
      for (const row of rows) {
        if (!row.columnId) continue;
        await this.prisma.sysGenColumn.update({
          where: { columnId: BigInt(row.columnId) },
          data: {
            columnComment: row.columnComment,
            tsField: row.tsField,
            tsType: row.tsType,
            htmlType: row.htmlType,
            dictType: row.dictType,
            isInsert: row.isInsert,
            isEdit: row.isEdit,
            isList: row.isList,
            isQuery: row.isQuery,
            queryType: row.queryType,
            isRequired: row.isRequired,
            updateBy: username,
          },
        });
      }
    }
    return { success: true };
  }

  /** 工具方法：转驼峰 */
  private toCamelCase(str: string, pascal: boolean = false): string {
    const camel = str.replaceAll(/([-_][a-z])/gi, ($1) =>
      $1.toUpperCase().replace('-', '').replace('_', ''),
    );
    if (pascal) return camel.charAt(0).toUpperCase() + camel.slice(1);
    return camel;
  }
}
