import {
  Column,
  DataType,
  IsIn,
  IsUUID,
  Length,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'store', comment: '店铺列表' })
export class Store extends Model<any> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    comment: '主键id',
  })
  id: string;

  @Length({ min: 2, max: 32, msg: '店铺名称的长度在2-36个字符' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: '所属商户',
  })
  shop: string;

  @NotEmpty({ msg: '店铺名称不能为空' })
  @Length({ min: 2, max: 32, msg: '店铺名称的长度在2-36个字符' })
  @Column({ type: DataType.STRING(20), allowNull: false, comment: '店铺名称' })
  store_name: string;

  @Column({ type: DataType.STRING(200), allowNull: false, comment: '店铺地址' })
  address: string;

  @Column({ type: DataType.STRING, comment: '联系方式' })
  phone: string;

  @Column({
    type: DataType.STRING(20),
    comment: '店铺管理员',
  })
  store_manager: string;

  //角色状态
  @IsIn({
    args: [[0, 1]],
    msg: 'status 字段值错误',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '店铺状态（0:禁用，1：正常）',
  })
  status;
}
