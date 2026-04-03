import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { PaymentMethodService } from './payment-method.service';
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}
  @Post() async create(@Body() data: any) {
    return this.paymentMethodService.create(data, 'admin');
  }
  @Get('list') async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('paymentType') paymentType?: string,
    @Query('payerName') payerName?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.paymentMethodService.findAll(
      {
        fiscalYear,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        payerName,
        paymentType,
        status,
      },
      requestContext,
    );
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    return this.paymentMethodService.findOne(BigInt(id));
  }
  @Put(':id') async update(@Param('id') id: string, @Body() data: any) {
    return this.paymentMethodService.update(BigInt(id), data, 'admin');
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return this.paymentMethodService.remove(BigInt(id));
  }
}
