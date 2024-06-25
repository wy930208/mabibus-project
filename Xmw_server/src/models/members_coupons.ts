import {
  AutoIncrement,
  Column,
  DataType,
  IsDate,
  IsIn,
  Length,
  Min,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'members_coupons', comment: '会员卡券' })
export class Store extends Model<any> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    comment: '主键ID',
  })
  id: number;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    comment: '核销码',
  })
  write_off_code: string;

  @Column({
    type: DataType.UUIDV4,
    allowNull: false,
    comment: '客户ID',
  })
  customer_id: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    comment: '余额',
  })
  balance: number;

  @Column({
    type: DataType.INTEGER,
    comment: '剩余次数',
  })
  remaining_times: number;

  @Column({
    type: DataType.UUIDV4,
    comment: '开卡店铺',
  })
  create_store: string;
}
