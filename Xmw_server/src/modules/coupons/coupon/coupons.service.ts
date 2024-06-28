import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Coupons } from '@/models/coupons.model';
import { OrganizationService } from '@/modules/administrative/organization/organization.service';
import { responseMessage } from '@/utils';
import { SessionTypes } from '@/utils/types';

// import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupons)
    private readonly couponsModel: typeof Coupons,
    private readonly organizationService: OrganizationService,
  ) {}

  async create(createCouponDto: any, session: SessionTypes) {
    const orgId = session.currentUserInfo?.org_id;
    if (!orgId) return responseMessage(null);

    const data = await this.couponsModel.create({
      ...createCouponDto,
      orgId: orgId,
    });
    return responseMessage(data);
  }

  async findAll(session: SessionTypes) {
    const orgId = session.currentUserInfo?.org_id;
    if (!orgId) return responseMessage([]);

    const orgIdList =
      await this.organizationService.getSelfAndChildrenOrgId(orgId);
    const data = await this.couponsModel.findAll({
      where: {
        org_id: { [Op.in]: orgIdList },
      },
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
