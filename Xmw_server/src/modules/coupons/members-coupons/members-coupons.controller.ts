import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateMembersCouponDto } from './dto/create-members-coupon.dto';
import { UpdateMembersCouponDto } from './dto/update-members-coupon.dto';
import { MembersCouponsService } from './members-coupons.service';

@Controller('members-coupons')
export class MembersCouponsController {
  constructor(private readonly membersCouponsService: MembersCouponsService) {}

  @Post()
  create(@Body() createMembersCouponDto: CreateMembersCouponDto) {
    return this.membersCouponsService.create(createMembersCouponDto);
  }

  @Get()
  findAll(@Query('id') id: string) {
    return this.membersCouponsService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersCouponsService.findOne(+id);
  }

  @Patch()
  update(@Body() dto: UpdateMembersCouponDto) {
    return this.membersCouponsService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersCouponsService.remove(+id);
  }
}
