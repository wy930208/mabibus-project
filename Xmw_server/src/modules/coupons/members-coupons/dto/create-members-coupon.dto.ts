export class CreateMembersCouponDto {
  coupon_id: number;
  customers: string[];
  quantity: number;
  write_off_code: string;
  write_off_times: number;
  write_off_amount: number;
}
