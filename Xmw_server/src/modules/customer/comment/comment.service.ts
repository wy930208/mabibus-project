import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CustomerComments } from '@/models/customer_comments.model';
import { XmwUser } from '@/models/xmw_user.model';
import { responseMessage } from '@/utils';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CustomerComments)
    private readonly customerCommentsModel: typeof CustomerComments,
  ) {}
  async create(dto) {
    const result = await this.customerCommentsModel.create(dto);
    return responseMessage(result);
  }

  async findAll({ customer_id }: { customer_id: string }) {
    const result = await this.customerCommentsModel.findAll({
      where: {
        customer_id,
      },
      order: [['created_time', 'desc']],
      attributes: {
        include: ['u.cn_name', 'u.avatar_url'],
      },
      // 联表查询
      include: [
        {
          model: XmwUser,
          as: 'u',
          attributes: [],
        },
      ],
      raw: true,
    });
    return responseMessage(result);
  }
}
