import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Coupons } from '@/models/coupons.model';
import { Customer } from '@/models/customer.model';
import { MembersCoupons } from '@/models/members_coupons..model';
import { Store } from '@/models/store.model';
import { responseMessage } from '@/utils';

// import { CreateMembersCouponDto } from './dto/create-members-coupon.dto';
import { UpdateMembersCouponDto } from './dto/update-members-coupon.dto';

@Injectable()
export class MembersCouponsService {
  constructor(
    @InjectModel(MembersCoupons)
    private readonly membersCouponsModel: typeof MembersCoupons,
  ) {}

  async create(dto: any) {
    const res = await this.membersCouponsModel.create(dto);

    return responseMessage(res);
  }

  async findAll() {
    const res = await this.membersCouponsModel.findAll({
      order: [['created_time', 'desc']],
      attributes: {
        include: [
          's.store_name',
          'c.user_name',
          'p.coupon_name',
          'p.coupon_type',
          'p.amount',
        ],
      },
      // 联表查询
      include: [
        {
          model: Coupons,
          as: 'p',
          attributes: [],
        },
        {
          model: Customer,
          as: 'c',
          attributes: [],
        },
        {
          model: Store,
          as: 's',
          attributes: [],
        },
      ],
      raw: true,
    });

    return responseMessage(res);
  }

  findOne(id: number) {
    return `This action returns a #${id} membersCoupon`;
  }

  update(id: number, updateMembersCouponDto: UpdateMembersCouponDto) {
    return `This action updates a #${id} membersCoupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} membersCoupon`;
  }
}
