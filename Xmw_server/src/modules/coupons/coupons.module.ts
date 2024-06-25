import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Coupons } from '@/models/coupons.model';

import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
  imports: [SequelizeModule.forFeature([Coupons])],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
