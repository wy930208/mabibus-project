import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, type WhereOptions } from 'sequelize';

import { Customer } from '@/models/customer.model';
import { Store } from '@/models/store.model';
import { responseMessage } from '@/utils';

import { GetCustomerListDto } from './dto';

// import { CreateCustomerDto } from './dto/create-customer.dto';
// import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
  ) {}

  async create(createCustomerDto: any) {
    const result = await this.customerModel.create(createCustomerDto);
    return responseMessage(result);
  }

  async bulkCreate(createCustomerDto: any) {
    const result = await this.customerModel.bulkCreate(createCustomerDto);
    return responseMessage(result);
  }

  async findAll(customerInfo?: GetCustomerListDto) {
    let where: WhereOptions<GetCustomerListDto>;
    if (customerInfo) {
      where = {
        deal: { [Op.eq]: customerInfo.deal },
      };
    }

    const result = await this.customerModel.findAll({
      attributes: {
        include: ['s.store_name'],
      },
      where,
      order: [['created_time', 'desc']],
      // 联表查询
      include: [
        {
          model: Store,
          as: 's',
          attributes: [],
        },
      ],
      raw: true,
    });
    return responseMessage(result);
  }

  async findOne(id: string) {
    const result = await this.customerModel.findOne({
      where: {
        id,
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
