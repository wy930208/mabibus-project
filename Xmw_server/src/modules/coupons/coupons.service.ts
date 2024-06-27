import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Coupons } from '@/models/coupons.model';
import { responseMessage } from '@/utils';
import { SessionTypes } from '@/utils/types';

// import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupons)
    private readonly couponsModel: typeof Coupons,
  ) {}

  async create(createCouponDto: any, session: SessionTypes) {
    console.log('=====session====', session.currentUserInfo.org_id);
    const data = await this.couponsModel.create({
      ...createCouponDto,
      orgId: session.currentUserInfo.org_id,
    });
    return responseMessage(data);
  }

  async findAll() {
    const data = await this.couponsModel.findAll({
      order: [['created_time', 'desc']],
    });
    return responseMessage(data);
  }

  async findOne(id: string) {
    const data = await this.couponsModel.findOne({
      where: { id },
    });
    return responseMessage(data);
  }

  async update(updateCouponDto: UpdateCouponDto) {
    const { id, ...otherDto } = updateCouponDto;
    const data = await this.couponsModel.update(otherDto, {
      where: { id },
    });
    return responseMessage(data);
  }

  async remove(id: number) {
    const data = await this.couponsModel.destroy({
      where: { id },
    });
    return responseMessage(data);
  }
}
