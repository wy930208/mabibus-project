export class CreateMembersCouponDto {
  id: number;
  coupon_id: number;
  customers: string[];
  quantity: number;
  write_off_code: string;
  write_off_times: number;
  write_off_amount: number;
  write_off_remark: string;
}
