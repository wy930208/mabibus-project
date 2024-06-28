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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SessionTypes } from '@/utils/types';

import { CustomerService } from './customer.service';
import { GetCustomerListDto } from './dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer/info')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Session() session: SessionTypes,
  ) {
    return this.customerService.create({
      ...createCustomerDto,
      orgId: session.currentUserInfo?.org_id,
    });
  }

  @Post('bulk-create')
  batchCreate(@Body() dto: any, @Session() session: SessionTypes) {
    return this.customerService.bulkCreate(
      dto.map((item) => {
        return {
          ...item,
          orgId: session.currentUserInfo.org_id,
        };
      }),
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Query() customerInfo: GetCustomerListDto,
    @Session() session: SessionTypes,
  ) {
    const orgId = session.currentUserInfo?.org_id;
    return this.customerService.findAll(customerInfo, orgId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Session() session: SessionTypes) {
    const orgId = session.currentUserInfo?.org_id;
    return this.customerService.findOne(id, orgId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
