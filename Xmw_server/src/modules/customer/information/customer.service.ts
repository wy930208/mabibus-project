import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, type WhereOptions } from 'sequelize';

import { Customer } from '@/models/customer.model';
import { XmwOrganization } from '@/models/xmw_organization.model';
import { responseMessage } from '@/utils';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
    @InjectModel(XmwOrganization)
    private readonly orgModel: typeof XmwOrganization,
  ) {}

  async create(createCustomerDto: any) {
    const result = await this.customerModel.create(createCustomerDto);
    return responseMessage(result);
  }

  async bulkCreate(dto: any) {
    const result = await this.customerModel.bulkCreate(dto);
    return responseMessage(result);
  }

  /**
   * 获取当前组织和其子级的 ID
   * @param id
   */
  async getOrgList(id: string) {
    const list = [id];
    // 获取子级
    const result = await this.orgModel.findAll({
      raw: true,
      attributes: ['org_id'],
      where: {
        parent_id: { [Op.eq]: id },
      },
    });

    result?.forEach((item) => {
      list.push(item.org_id);
    });

    return list;
  }

  async findAll(customerInfo?: any, orgId?: string) {
    // 无法获取组织店铺的信息，直接返回
    // if (!orgId) return responseMessage([]);

    let where: WhereOptions;
    if (customerInfo) {
      where = {
        deal: { [Op.eq]: customerInfo.deal },
        user_name: {
          [Op.like]: `%${customerInfo?.user_name || ''}%`,
        },
        phone: {
          [Op.like]: `%${customerInfo?.phone || ''}%`,
        },
      };

      if (customerInfo.add_wechat !== undefined) {
        where.add_wechat = customerInfo.add_wechat;
      }
      if (customerInfo.can_go_house !== undefined) {
        where.can_go_house = customerInfo.can_go_house;
      }

      if (customerInfo.inactiveDate) {
        where.last_visit_store_time = {
          [Op.lt]: customerInfo.inactiveDate,
        };
      }
    }

    const list = await this.getOrgList(orgId);

    where = {
      ...where,
      // org_id: { [Op.in]: list },
    };

    console.log('===where===', where);

    const result = await this.customerModel.findAll({
      attributes: {
        include: ['o.org_name'],
      },
      where,
      order: [['created_time', 'desc']],
      // 联表查询
      include: [
        {
          model: XmwOrganization,
          as: 'o',
          attributes: [],
        },
      ],
      raw: true,
    });
    return responseMessage(result);
  }

  async findOne(id: string, orgId?: string) {
    const list = await this.getOrgList(orgId);
    const result = await this.customerModel.findOne({
      where: {
        id,
        org_id: { [Op.in]: list },
      },
    });
    return responseMessage(result);
  }

  async update(id: string, updateCustomerDto: any) {
    const result = await this.customerModel.update(updateCustomerDto, {
      where: {
        id,
      },
    });
    return responseMessage(result);
  }

  async remove(id: string) {
    const result = await this.customerModel.destroy({
      where: { id },
    });
    return responseMessage(result);
  }
}
