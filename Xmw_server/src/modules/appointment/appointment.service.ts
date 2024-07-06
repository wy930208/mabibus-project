import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { keyBy } from 'lodash';
import { Op, Sequelize } from 'sequelize';

import { Appointment } from '@/models/appointment_service.model';
import { Coupons } from '@/models/coupons.model';
import { Customer } from '@/models/customer.model';
import { XmwUser } from '@/models/xmw_user.model';
import { responseMessage } from '@/utils';
import { SessionTypes } from '@/utils/types';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,

    @InjectModel(Coupons)
    private readonly couponsModel: typeof Coupons,
  ) {}

  async create(dto) {
    const result = await this.appointmentModel.create(dto);
    return responseMessage(result);
  }

  async findAll(query: { date?: string }, session: SessionTypes) {
    const org_id = session.currentUserInfo?.org_id;

    const coupons = await this.couponsModel.findAll({
      raw: true,
    });

    const couponsMpa = keyBy(coupons, 'id');

    const data = await this.appointmentModel.findAll({
      where: query.date
        ? {
            appointment_time: {
              [Op.gte]: query.date + ' 00:00:00',
              [Op.lte]: query.date + ' 23:59:59',
            },
          }
        : undefined,
      attributes: {
        include: [
          [Sequelize.col('c.phone'), 'customer_phone'],
          [Sequelize.col('c.user_name'), 'customer_name'],
          [Sequelize.col('u.user_name'), 'teacher_name'],
          'co.coupon_name',
        ],
      },
      // 联表查询
      include: [
        {
          model: Customer,
          as: 'c',
          attributes: [],
        },
        {
          model: XmwUser,
          as: 'u',
          attributes: [],
        },
        {
          model: Coupons,
          as: 'co',
          attributes: [],
        },
      ],
      raw: true,
      order: [['created_time', 'desc']],
    });

    return responseMessage(
      data.map((item) => {
        return {
          ...item,
          service_items: item.service_items?.map((id) => couponsMpa[id]),
        };
      }),
    );
  }
}
