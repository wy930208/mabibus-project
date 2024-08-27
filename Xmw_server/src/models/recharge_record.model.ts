import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  Table,
} from 'sequelize-typescript';

import { Coupons } from './coupons.model';
import { Customer } from './customer.model';
import { XmwOrganization } from './xmw_organization.model';
import { XmwUser } from './xmw_user.model';

/**
 * 充值明细
 */
@Table({ tableName: 'recharge_details.model' })
export class Appointment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    comment: '主键ID',
  })
  recharge_id: number;

  @IsUUID(4)
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '客户iD',
  })
  customer_id!: string;

  @ForeignKey(() => XmwOrganization)
  @Column({
    type: DataType.STRING(36),
    allowNull: false,
    comment: '组件ID(门店ID)',
  })
  org_id: string;

  @IsUUID(4)
  @ForeignKey(() => XmwUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '销售人员',
  })
  sales: string;

  @IsUUID(4)
  @ForeignKey(() => XmwUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '操作人',
  })
  operator: string;

  @Column({
    type: DataType.STRING,
    comment: '备注',
  })
  remark?: string;

  @BelongsTo(() => Customer, { as: 'c' })
  customer_info: Customer;

  @BelongsTo(() => XmwOrganization, { as: '0' })
  org_info: XmwOrganization;

  @BelongsTo(() => XmwUser, { as: 'u' })
  usr_info: XmwUser;

  @HasMany(() => Coupons, { as: 'co' })
  coupons: Coupons[];
}
