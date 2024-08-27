import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { keyBy } from 'lodash';
import { Op } from 'sequelize';

import { Coupons } from '@/models/coupons.model';
import { ProductSales } from '@/models/sale_logs.mode';
import { responseMessage } from '@/utils';
import { SessionTypes } from '@/utils/types';

import { OrganizationService } from '../administrative/organization/organization.service';
import { MembersCouponsService } from '../coupons/members-coupons/members-coupons.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(ProductSales)
    private readonly saleLogs: typeof ProductSales,

    @InjectModel(Coupons)
    private readonly couponsModel: typeof Coupons,
    private readonly membersCouponsService: MembersCouponsService,

    private readonly organizationService: OrganizationService,
  ) {}

  async create(dto, session: SessionTypes) {
    const org_id = session.currentUserInfo?.org_id;

    const promiseArr = dto.product_items.map((id: string) => {
      return this.membersCouponsService.create({
        coupon_id: id,
        customers: [dto.customer_id],
        quantity: 1,
        sales_id: dto.sales,
        create_store: org_id,
      });
    });

    // 插入日志
    const result = (await Promise.all(promiseArr)).map(
      (item) => item.data[0].id,
    );

    const useId = session.currentUserInfo.user_id;
    await this.saleLogs.create({
      ...dto,
      product_items: result,
      belongs_store: org_id,
      operator: useId,
    });
    return responseMessage(result);
  }

  async findAll(_, session: SessionTypes) {
    const org_id = session.currentUserInfo?.org_id;
    if (!org_id) return responseMessage(null);

    const orgIdList =
      await this.organizationService.getSelfAndChildrenOrgId(org_id);

    console.log('===orgIdList====', org_id, orgIdList);

    const result = await this.saleLogs.findAll({
      where: {
        belongs_store: { [Op.in]: orgIdList },
      },
    });

    return responseMessage(result);
  }
}
