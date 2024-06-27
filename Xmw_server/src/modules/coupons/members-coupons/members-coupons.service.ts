import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Coupons } from '@/models/coupons.model';
import { Customer } from '@/models/customer.model';
import { MembersCoupons } from '@/models/members_coupons.model';
import { Store } from '@/models/store.model';
import { responseMessage } from '@/utils';

// import { CreateMembersCouponDto } from './dto/create-members-coupon.dto';
import { UpdateMembersCouponDto } from './dto/update-members-coupon.dto';

@Injectable()
export class MembersCouponsService {
  constructor(
    @InjectModel(MembersCoupons)
    private readonly membersCouponsModel: typeof MembersCoupons,
    @InjectModel(Coupons)
    private readonly couponsModel: typeof Coupons,
  ) {}

  async create(dto: any) {
    const couponList = [];
    // 查询优惠券
    const coupon = await this.couponsModel.findOne({
      where: {
        id: {
          [Op.eq]: dto.coupon_id,
        },
      },
    });

    // 批量创建会员卡券，并且回填默认面额、次数
    dto.customers.forEach((customerId) => {
      const currentDate = new Date();
      const daysLater = new Date(
        currentDate.getTime() + coupon?.expireDay * 24 * 60 * 60 * 1000,
      );

      for (let i = 0; i < dto.quantity; i++) {
        couponList.push({
          coupons_id: coupon.id,
          customer_id: customerId,
          balance: coupon.amount,
          remaining_times: coupon.times,
          status: 0,
          // 如果是固定时间，结束时间则为过期时间，否则为当前时间+优惠券过期天数
          expire_time:
            coupon.expire_type === 'fix' ? coupon.endTime : daysLater,
        });
      }
    });

    const res = await this.membersCouponsModel.bulkCreate(couponList);
    return responseMessage(res);
  }

  async findAll(id?: number) {
    let where = {};
    if (id) {
      where = { where: { id } };
    }
    const res = await this.membersCouponsModel.findAll({
      ...where,
      order: [['created_time', 'desc']],
      attributes: {
        include: [
          's.store_name',
          'c.user_name',
          'c.phone',
          'p.coupon_name',
          'p.coupon_type',
          'p.times',
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

  async update(dto: UpdateMembersCouponDto) {
    /**
     * 1. 查询会员卡券
     * 2. 判断会员卡券类型
     * 3. 金额扣减、次数扣减
     */
    // const res = this.membersCouponsModel
    // return `This action updates a #${id} membersCoupon`;
    const memberCoupon = await this.membersCouponsModel.findOne({
      where: {
        write_off_code: {
          [Op.eq]: dto.write_off_code,
        },
      },
    });

    const payload: Record<string, any> = {};

    if (memberCoupon) {
      // 核销次数
      if (dto.write_off_times) {
        const newTimes = memberCoupon.remaining_times - dto.write_off_times;

        if (newTimes <= 0) {
          payload.status = 1;
        } else {
          payload.status = 2;
        }

        payload.remaining_times = newTimes;
      }

      if (dto.write_off_amount) {
        const newBalance = memberCoupon.balance - dto.write_off_amount;

        if (newBalance <= 0) {
          payload.status = 1;
        } else {
          payload.status = 2;
        }

        payload.balance = newBalance;
      }
    }

    this.membersCouponsModel.update(payload, {
      where: {
        write_off_code: dto.write_off_code,
      },
    });

    return responseMessage(memberCoupon);
  }

  async remove(id: number) {
    const result = await this.membersCouponsModel.destroy({
      where: { id },
    });
    return responseMessage(result);
  }
}
