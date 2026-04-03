import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ContractEvaluationService } from './contract-evaluation.service';
@Controller('contract-evaluation')
export class ContractEvaluationController {
  constructor(private readonly contractEvaluationService: ContractEvaluationService) {}
  @Post() async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.contractEvaluationService.create(data, 'admin', requestContext);
  }
  @Get('list') async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('contractName') contractName?: string,
    @Query('evaluator') evaluator?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('evaluationStatus') evaluationStatus?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.contractEvaluationService.findAll(
      {
        contractName,
        evaluationStatus,
        evaluator,
        fiscalYear,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        status,
      },
      requestContext,
    );
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    return this.contractEvaluationService.findOne(BigInt(id));
  }
  @Put(':id') async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.contractEvaluationService.update(BigInt(id), data, 'admin', requestContext);
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return this.contractEvaluationService.remove(BigInt(id));
  }
}
