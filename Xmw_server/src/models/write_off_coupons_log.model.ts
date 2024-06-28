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

import { MembersCoupons } from './members_coupons.model';
import { XmwUser } from './xmw_user.model';

@Table({ tableName: 'write_off_coupons_log', comment: '卡券核销日志' })
export class WriteOffCouponsLog extends Model<any> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    comment: '核销流水ID',
  })
  log_id: string;

  @ForeignKey(() => MembersCoupons)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '所核销的会员卡券ID',
  })
  member_coupon_id: string;

  @Column({ type: DataType.INTEGER, comment: '本次核销的金额' })
  write_off_amount?: number;

  @Column({
    type: DataType.INTEGER,
    comment: '本次核销后剩余金额',
  })
  balance?: number;

  @Column({ type: DataType.INTEGER, comment: '本次核销的次数' })
  write_off_times?: number;

  @Column({
    type: DataType.INTEGER,
    comment: '本次核销后剩余次数',
  })
  remaining_times?: number;

  @Column({
    type: DataType.TEXT,
    comment: '备注信息',
  })
  remark?: string;

  @IsIn({
    args: [[0, 1]],
    msg: 'status 字段值错误',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '状态（0:核销，1：撤销)',
  })
  status;

  @IsUUID(4)
  @ForeignKey(() => XmwUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '操作人ID',
  })
  operator: string;

  @BelongsTo(() => MembersCoupons, { as: 'm' })
  membersCouponsInfo: MembersCoupons;

  @BelongsTo(() => XmwUser, { as: 'u' })
  userInfo: XmwUser;
}
