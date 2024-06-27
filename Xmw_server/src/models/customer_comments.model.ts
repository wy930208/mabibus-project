import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Customer } from './customer.model';
import { XmwUser } from './xmw_user.model';

@Table({ tableName: 'customer_comments', comment: '客户评论' })
export class CustomerComments extends Model<any> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '评论ID',
  })
  id: string;

  // 客户ID
  @NotEmpty({ msg: '用户ID不能为空' })
  @ForeignKey(() => Customer)
  @Column({ type: DataType.UUID, allowNull: false, comment: '用户 ID' })
  customer_id: string;

  @NotEmpty({ msg: '评论内容不能为空' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '评论内容',
  })
  content: string;

  // 评论者ID
  @NotEmpty({ msg: '用户ID不能为空' })
  @ForeignKey(() => XmwUser)
  @Column({ type: DataType.UUID, allowNull: false, comment: '评论者ID' })
  from_uid: string;

  @Column({
    type: DataType.UUID,
    comment: '组织ID',
  })
  orgId: string;

  @BelongsTo(() => Customer, { as: 'c' })
  customerInfo: Customer;

  @BelongsTo(() => XmwUser, { as: 'u' })
  userInfo: XmwUser;
}
