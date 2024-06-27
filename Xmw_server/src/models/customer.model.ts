import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Is,
  IsDate,
  IsEmail,
  IsIn,
  IsUrl,
  IsUUID,
  Length,
  Min,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Store } from '@/models/store.model';
import type { Sex, Status } from '@/utils/types';

@Table({ tableName: 'customer', comment: '客户列表' })
export class Customer extends Model<any> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    comment: '用户id',
  })
  id: string;

  //用户名称
  @NotEmpty({ msg: '用户名称不能为空' })
  @Length({ min: 2, max: 32, msg: '用户名称的长度在2-36个字符' })
  @Column({ type: DataType.STRING(20), allowNull: false, comment: '用户名称' })
  user_name: string;

  //电子邮箱
  @IsEmail
  @Column({
    type: DataType.STRING(50),
    comment: '电子邮箱',
  })
  email?: string;

  //电话号码
  @Is({ args: /^1\d{10}$/, msg: '电话号码格式不正确' })
  @Column({
    type: DataType.STRING(11),
    allowNull: false,
    comment: '电话号码',
  })
  phone: string;

  //用户头像
  @IsUrl
  @Column({ type: DataType.STRING(200), comment: '用户头像' })
  avatar_url?: string;

  //用户性别
  @IsIn({
    args: [['0', '1', '2']],
    msg: '用户性别: sex 字段值错误',
  })
  @Column({
    type: DataType.ENUM,
    values: ['0', '1', '2'],
    comment: '用户性别(0:女,1:男,2:隐私)',
  })
  sex: Sex;

  @Min(0)
  @Column({
    type: DataType.FLOAT({ decimals: 2 }),
    defaultValue: 0,
    allowNull: false,
    comment: '余额',
  })
  amount: number;

  @Min(0)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: '积分',
  })
  point: number;

  //用户状态
  @IsIn({
    args: [[0, 1]],
    msg: 'status 字段值错误',
  })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
    comment: '用户状态（0:禁用，1：正常）',
  })
  status: Status;

  //成交状态
  @IsIn({
    args: [[0, 1]],
    msg: 'deal 字段值错误',
  })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
    comment: '成交状态（0:潜在客户，1：已成交）',
  })
  deal: Status;

  //上次到店时间
  @IsDate
  @Column({
    type: DataType.DATE,
    comment: '纪念日',
  })
  anniversary;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: '用户当前办理的卡列表',
  })
  cards_id: string[];

  //所属城市
  @IsUUID(4)
  @ForeignKey(() => Store)
  @Column({ type: DataType.UUID, comment: '所属门店 ID' })
  store_id?: string;

  //详细地址
  @Column({ type: DataType.STRING(200), comment: '家庭地址' })
  address?: string;

  //累计到店次数
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '到店次数',
  })
  visit_store_num?: number;

  //上次到店时间
  @IsDate
  @Column({
    type: DataType.DATE,
    comment: '上次到店时间',
  })
  last_visit_store_time?: Date;

  @Column({
    type: DataType.UUID,
    comment: '组织ID',
  })
  orgId: string;

  //下次预计到店时间
  @IsDate
  @Column({
    type: DataType.DATE,
    comment: '下次预计到店时间',
  })
  next_visit_store_time?: Date;

  @BelongsTo(() => Store, { as: 's' })
  storeInfo: Store;
}
