import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsIn,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Customer } from './customer.model';
import { XmwOrganization } from './xmw_organization.model';

@Table({ tableName: 'service_registration', comment: '服务登记' })
export class ServiceRegistration extends Model<any> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    comment: '服务流水号',
  })
  service_id: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '服务项目明细',
  })
  service_items: {
    count: number; // 数量,
    id: string;
    teacherId: string;
  }[];

  @IsIn({
    args: [['cash', 'ePayment', 'balance']],
    msg: 'payment_method 字段值错误',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['cash', 'ePayment', 'balance'],
    comment: '付款方式、现金、电子支付、余额扣款',
  })
  payment_method: number;

  @Column({ type: DataType.INTEGER, comment: '扣款金额' })
  amount?: number;

  @Column({
    type: DataType.TEXT,
    comment: '备注信息',
  })
  remark?: string;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.UUID, allowNull: false, comment: '客户 ID' })
  customer_id: string;

  @IsUUID(4)
  @ForeignKey(() => XmwOrganization)
  @Column({ type: DataType.STRING, comment: '门店', allowNull: true })
  store_id?: string;

  @BelongsTo(() => XmwOrganization, { as: 'o' })
  orgInfo: XmwOrganization;

  @BelongsTo(() => Customer, { as: 'c' })
  customerInfo: Customer;
}
