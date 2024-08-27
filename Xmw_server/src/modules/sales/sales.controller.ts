import { Body, Controller, Get, Post, Query, Session } from '@nestjs/common';

import type { SessionTypes } from '@/utils/types';

import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async getSalesList(
    @Query() query: { customerId: string },
    @Session() session: SessionTypes,
  ) {
    return this.salesService.findAll(query, session);
  }

  @Post()
  create(@Body() dto, @Session() session: SessionTypes) {
    return this.salesService.create(dto, session);
  }
}
