import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Coupons } from '@/models/coupons.model';
import { XmwOrganization } from '@/models/xmw_organization.model';
import { OrganizationService } from '@/modules/administrative/organization/organization.service';
import { OperationLogsModule } from '@/modules/system/operation-logs/operation-logs.module';

import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Coupons, XmwOrganization]),
    OperationLogsModule,
  ],
  controllers: [CouponsController],
  providers: [CouponsService, OrganizationService],
})
export class CouponsModule {}
