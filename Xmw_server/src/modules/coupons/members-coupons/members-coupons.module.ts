import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Coupons } from '@/models/coupons.model';
import { MembersCoupons } from '@/models/members_coupons.model';
import { ServiceRegistration } from '@/models/service_registration.model';
import { WriteOffCouponsLog } from '@/models/write_off_coupons_log.model';
import { XmwOrganization } from '@/models/xmw_organization.model';
import { OrganizationService } from '@/modules/administrative/organization/organization.service';
import { OperationLogsModule } from '@/modules/system/operation-logs/operation-logs.module';

import { MembersCouponsController } from './members-coupons.controller';
import { MembersCouponsService } from './members-coupons.service';

@Module({
  imports: [
    OperationLogsModule,
    SequelizeModule.forFeature([
      MembersCoupons,
      Coupons,
      XmwOrganization,
      WriteOffCouponsLog,
      ServiceRegistration,
    ]),
  ],
  controllers: [MembersCouponsController],
  providers: [MembersCouponsService, OrganizationService],
})
export class MembersCouponsModule {}
