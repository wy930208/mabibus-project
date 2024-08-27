import {
  Column,
  DataType,
  IsDate,
  IsIn,
  IsUUID,
  Length,
  Min,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
@Table({ tableName: 'coupons', comment: '卡券' })
export class Coupons extends Model<any> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    comment: '卡券ID',
  })
  id: number;

  @Length({ min: 2, max: 32, msg: '名称的长度在2-36个字符' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: '卡券名称',
  })
  coupon_name: string;

  @IsIn({
    args: [['times', 'prepaid', 'deduction']],
    msg: 'coupon_type 字段值错误',
  })
  @Column({
    type: DataType.ENUM('times', 'prepaid', 'deduction'),
    allowNull: false,
    comment: 'times 次卡、prepaid 储值卡、deduction: 抵扣券',
  })
  coupon_type: string;

  @Min(0)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '卡券金额',
  })
  amount: number;

  @Min(0)
  @Column({
    type: DataType.INTEGER,
    comment: '原价',
  })
  origin_price: number;

  @Min(0)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '销售价格',
  })
  sale_price: number;

  @Min(0)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '使用次数',
  })
  times: number;

  @IsIn({
    args: [['fix', 'flex']],
    msg: 'expire_type 字段值错误',
  })
  @Column({
    type: DataType.ENUM('fix', 'flex'),
    allowNull: false,
    comment: '过期类型（fix:固定时间，flex：领取后{expireDay}过期）',
  })
  expire_type: string;

  @IsDate
  @Column({
    type: DataType.DATE,
    comment: '开始生效时间',
  })
  beginTime?: Date;

  @IsDate
  @Column({
    type: DataType.DATE,
    comment: '到期时间',
  })
  endTime?: Date;

  @Column({
    type: DataType.INTEGER,
    comment: '领取{expireDay}天过期',
  })
  expireDay: number;

  @Column({
    type: DataType.TEXT,
    comment: '卡券描述',
  })
  description: string;

  @Column({
    type: DataType.JSON,
    comment: '适用店铺',
  })
  applicable_stores: string;

  @Column({
    type: DataType.STRING,
    comment: '备注',
  })
  remark: string;

  //角色状态
  @IsIn({
    args: [[0, 1]],
    msg: 'status 字段值错误',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '状态（0:禁用，1：正常）',
  })
  status: number;

  @IsUUID(4)
  @Column({ type: DataType.UUID, comment: '所属组织id' })
  orgId?: string;
}
