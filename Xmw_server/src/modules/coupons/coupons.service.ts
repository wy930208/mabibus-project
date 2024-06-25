import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Coupons } from '@/models/coupons.model';
import { responseMessage } from '@/utils';

// import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupons)
    private readonly couponsModel: typeof Coupons,
  ) {}

  async create(createCouponDto: any) {
    const data = await this.couponsModel.create(createCouponDto);
    return responseMessage(data);
  }

  async findAll() {
    const data = await this.couponsModel.findAll();
    return responseMessage(data);
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
