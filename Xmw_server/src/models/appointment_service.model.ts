import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  IsIn,
  IsUUID,
  Model,
  Table,
} from 'sequelize-typescript';

import { Coupons } from './coupons.model';
import { Customer } from './customer.model';
import { XmwOrganization } from './xmw_organization.model';
import { XmwUser } from './xmw_user.model';

@Table({ tableName: 'appointment_service' })
export class Appointment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    comment: '主键ID',
  })
  service_id: number;

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

  @IsIn({
    args: [['store', 'home']],
    msg: '用户性别: service_mode 字段值错误',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['store', 'home'],
    comment: '服务方式, store-到店 home-上门',
  })
  service_mode: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '服务项目',
  })
  @ForeignKey(() => Coupons)
  service_items: string[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: '预约时间',
  })
  appointment_time: Date;

  @IsIn({
    args: [['store', 'phone', 'wechat']],
    msg: '用户性别: appointment_mode 字段值错误',
  })
  @Column({
    type: DataType.ENUM,
    values: ['store', 'phone', 'wechat'],
    comment: '预约方式, 门店预约、电话预约、微信预约',
  })
  appointment_mode?: string;

  @IsUUID(4)
  @ForeignKey(() => XmwUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '预约老师',
  })
  appointment_teacher: string;

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
