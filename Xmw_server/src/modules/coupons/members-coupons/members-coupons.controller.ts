import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';

import { SessionTypes } from '@/utils/types';

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
  findAll(@Query('id') id: string, @Session() session: SessionTypes) {
    return this.membersCouponsService.findAll(+id, session);
  }

  @Patch()
  update(
    @Body() dto: UpdateMembersCouponDto,
    @Session() session: SessionTypes,
  ) {
    return this.membersCouponsService.update(dto, session);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersCouponsService.remove(+id);
  }

  @Get('logs')
  findWriteOffLog(@Session() session: SessionTypes) {
    return this.membersCouponsService.findWriteOffLog(session);
  }
}
