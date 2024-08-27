import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Coupons } from '@/models/coupons.model';
import { MembersCoupons } from '@/models/members_coupons.model';
import { ProductSales } from '@/models/sale_logs.mode';
import { WriteOffCouponsLog } from '@/models/write_off_coupons_log.model';
import { XmwOrganization } from '@/models/xmw_organization.model';
import { MembersCouponsService } from '@/modules/coupons/members-coupons/members-coupons.service';

import { OrganizationService } from '../administrative/organization/organization.service';
import { OperationLogsModule } from '../system/operation-logs/operation-logs.module';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [
    OperationLogsModule,
    SequelizeModule.forFeature([
      ProductSales,
      Coupons,
      MembersCoupons,
      WriteOffCouponsLog,
      XmwOrganization,
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService, MembersCouponsService, OrganizationService],
})
export class SalesModule {}
