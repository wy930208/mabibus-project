import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MembersCoupons } from '@/models/members_coupons.model';
import { Coupons } from '@/models/coupons.model';

import { MembersCouponsController } from './members-coupons.controller';
import { MembersCouponsService } from './members-coupons.service';

@Module({
  imports: [SequelizeModule.forFeature([MembersCoupons, Coupons])],
  controllers: [MembersCouponsController],
  providers: [MembersCouponsService],
})
export class MembersCouponsModule {}
