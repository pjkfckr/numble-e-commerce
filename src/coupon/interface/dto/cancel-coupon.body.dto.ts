import { PickType } from '@nestjs/swagger';
import { UserCouponDto } from './user-coupon.dto';

export class CancelCouponBodyDto extends PickType(UserCouponDto, [
  'user_id',
  'coupon_id',
] as const) {}
