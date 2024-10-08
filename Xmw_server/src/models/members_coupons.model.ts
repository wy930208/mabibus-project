import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsDate,
  IsIn,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Coupons } from './coupons.model';
import { Customer } from './customer.model';
import { Store } from './store.model';
import { XmwOrganization } from './xmw_organization.model';

@Table({ tableName: 'members_coupons', comment: '会员卡券' })
export class MembersCoupons extends Model<any> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    comment: '主键ID',
  })
  id: number;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.UUID, allowNull: false, comment: '用户 ID' })
  customer_id: string;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    comment: '核销码',
  })
  write_off_code: string;

  @IsUUID(4)
  @ForeignKey(() => Coupons)
  @Column({ type: DataType.UUID, allowNull: false, comment: '卡券 ID' })
  coupons_id?: string;

  @Column({
    type: DataType.INTEGER,
    comment: '余额',
  })
  balance: number;

  @Column({
    type: DataType.INTEGER,
    comment: '剩余次数',
  })
  remaining_times: number;

  @IsIn({
    args: [[0, 1, 2]],
    msg: 'status 字段值错误',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '核销状态（0:未核销，1：已核销，2：部分核销）',
  })
  status;

  @IsDate
  @Column({
    type: DataType.DATE,
    comment: '过期时间',
  })
  expire_time?: Date;

  @IsUUID(4)
  @ForeignKey(() => XmwOrganization)
  @Column({ type: DataType.UUID, comment: '适用门店' })
  applicable_store_id?: string;

  @IsUUID(4)
  @ForeignKey(() => Store)
  @Column({ type: DataType.UUID, comment: '归属门店' })
  create_store?: string;

  @BelongsTo(() => Customer, { as: 'c' })
  customerInfo: Customer;

  @BelongsTo(() => Store, { as: 's' })
  storeInfo: Store;

  @BelongsTo(() => Coupons, { as: 'p' })
  coupons: Coupons;

  @Column({
    type: DataType.STRING,
    comment: '销售人员ID',
    allowNull: true,
  })
  sales_id?: string;
}
