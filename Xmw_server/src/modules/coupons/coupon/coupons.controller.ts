import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';

import { SessionTypes } from '@/utils/types';

import { CouponsService } from '../coupon/coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  create(
    @Body() createCouponDto: CreateCouponDto,
    @Session() session: SessionTypes,
  ) {
    return this.couponsService.create(createCouponDto, session);
  }

  @Get()
  findAll(@Session() session: SessionTypes) {
    return this.couponsService.findAll(session);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Patch()
  update(@Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(updateCouponDto);
  }

  @Delete()
  remove(@Body() { id }: { id: string }) {
    return this.couponsService.remove(+id);
  }
}
