import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Coupons } from '@/models/coupons.model';
import { Customer } from '@/models/customer.model';
import { MembersCoupons } from '@/models/members_coupons.model';
import { Store } from '@/models/store.model';
import { WriteOffCouponsLog } from '@/models/write_off_coupons_log.model';
import { XmwUser } from '@/models/xmw_user.model';
import { OrganizationService } from '@/modules/administrative/organization/organization.service';
import { responseMessage } from '@/utils';
import { SessionTypes } from '@/utils/types';

// import { CreateMembersCouponDto } from './dto/create-members-coupon.dto';
import { UpdateMembersCouponDto } from './dto/update-members-coupon.dto';

@Injectable()
export class MembersCouponsService {
  constructor(
    @InjectModel(MembersCoupons)
    private readonly membersCouponsModel: typeof MembersCoupons,

    @InjectModel(WriteOffCouponsLog)
    private readonly writeOfLogModel: typeof WriteOffCouponsLog,

    @InjectModel(Coupons)
    private readonly couponsModel: typeof Coupons,

    private readonly organizationService: OrganizationService,
    private sequelize: Sequelize,
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
          sales_id: dto.sales_id,
          applicable_store_id: dto.applicable_store_id,
          // 如果是固定时间，结束时间则为过期时间，否则为当前时间+优惠券过期天数
          expire_time:
            coupon.expire_type === 'fix' ? coupon.endTime : daysLater,
        });
      }
    });

    const res = await this.membersCouponsModel.bulkCreate(couponList);
    return responseMessage(res);
  }

  async findAll(query: any, session?: SessionTypes) {
    const orgId = session?.currentUserInfo?.org_id;
    if (!orgId) return responseMessage([]);

    const orgIdList =
      await this.organizationService.getSelfAndChildrenOrgId(orgId);

    let where = {};
    if (query.id) {
      where = { where: { id: Number(query.id) } };
    }
    if (query.customerId) {
      where = { where: { customer_id: query.customerId } };
    }
    const res = await this.membersCouponsModel.findAll({
      ...where,
      order: [['created_time', 'desc']],
      attributes: {
        include: [
          's.store_name',
          'c.user_name',
          'c.org_id',
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
          where: {
            org_id: {
              [Op.in]: orgIdList,
            },
          },
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

  async update(dto: UpdateMembersCouponDto, session: SessionTypes) {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();

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
        transaction,
      });
      const userId = session.currentUserInfo.user_id;
      const payload: Record<string, any> = {};
      const logPayload: Record<string, any> = {
        member_coupon_id: dto.id,
        operator: userId,
        remark: dto.write_off_remark || '',
        status: 0,
      };

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

          logPayload.write_off_times = dto.write_off_times;
          logPayload.remaining_times = newTimes;
        }

        if (dto.write_off_amount) {
          const newBalance = memberCoupon.balance - dto.write_off_amount;

          if (newBalance <= 0) {
            payload.status = 1;
          } else {
            payload.status = 2;
          }

          payload.balance = newBalance;
          (logPayload.write_off_amount = dto.write_off_amount),
            (logPayload.balance = newBalance);
        }
      }

      await this.membersCouponsModel.update(payload, {
        where: {
          write_off_code: dto.write_off_code,
        },
        transaction,
      });

      console.log('====logPayload===', logPayload);

      await this.writeOfLogModel.create(logPayload, {
        transaction,
      });

      // Commit the transaction
      await transaction.commit();

      const record = await this.membersCouponsModel.findByPk(dto.id);

      return responseMessage(record);
    } catch (error) {
      // Rollback transaction if there's an error
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async remove(id: number) {
    const result = await this.membersCouponsModel.destroy({
      where: { id },
    });
    return responseMessage(result);
  }

  async findWriteOffLog(session: SessionTypes) {
    const orgId = session.currentUserInfo?.org_id;
    if (!orgId) return responseMessage([]);

    const orgIdList =
      await this.organizationService.getSelfAndChildrenOrgId(orgId);

    const result = await this.writeOfLogModel.findAll({
      order: [['created_time', 'desc']],
      attributes: {
        include: [
          [Sequelize.col('u.user_name'), 'operator_name'],
          [Sequelize.col('m.p.org_id'), 'org_id'],
          // 'u.org_id',
          'm.customer_id',
          'm.p.times',
          'm.p.amount',
          'm.p.coupon_name',
          'm.p.coupon_type',
          'm.c.phone',
          [Sequelize.col('m.c.user_name'), 'customer_name'],
        ],
      },
      // 联表查询
      include: [
        {
          model: MembersCoupons,
          as: 'm',
          attributes: [],
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
          ],
        },
        {
          model: XmwUser,
          as: 'u',
          attributes: [],
        },
      ],
      raw: true,
    });

    return responseMessage(
      result?.filter((record) => orgIdList.includes((record as any).org_id)),
    );
  }
}
