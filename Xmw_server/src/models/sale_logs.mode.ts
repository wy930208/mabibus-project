import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsIn,
  IsUUID,
  Min,
  Model,
  Table,
} from 'sequelize-typescript';

import { XmwOrganization } from './xmw_organization.model';
import { XmwUser } from './xmw_user.model';

/**
 * 产品销售
 */
@Table({ tableName: 'sale_logs' })
export class ProductSales extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    comment: '主键',
  })
  id: number;

  @IsUUID(4)
  @ForeignKey(() => XmwOrganization)
  @Column({ type: DataType.STRING(36), comment: '业绩归属门店' })
  belongs_store: string;

  @IsUUID(4)
  @ForeignKey(() => XmwUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '销售人员',
  })
  sales: string;

  @Min(0)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '销售金额',
  })
  sale_amount: number;

  @Min(0)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '实际付款金额',
  })
  payment_amount: number;

  @IsUUID(4)
  @ForeignKey(() => XmwUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '操作人',
  })
  operator: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '商品明细',
  })
  product_items: string[];

  @Column({
    type: DataType.STRING,
    comment: '备注',
  })
  remark?: string;

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

  @Column({
    type: DataType.STRING,
    comment: '付款信息',
  })
  payment_message?: string;

  @BelongsTo(() => XmwOrganization, { as: '0' })
  org_info: XmwOrganization;

  @BelongsTo(() => XmwUser, { as: 'u' })
  usr_info: XmwUser;
}
