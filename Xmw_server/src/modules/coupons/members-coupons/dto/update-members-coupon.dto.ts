import { PartialType } from '@nestjs/mapped-types';
import { CreateMembersCouponDto } from './create-members-coupon.dto';

export class UpdateMembersCouponDto extends PartialType(CreateMembersCouponDto) {}
