import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Customer } from '@/models/customer.model';
import { CustomerComments } from '@/models/customer_comments.model';
import { XmwOrganization } from '@/models/xmw_organization.model';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
@Module({
  imports: [
    SequelizeModule.forFeature([Customer, CustomerComments, XmwOrganization]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
