import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserCouponDto } from './user-coupon.dto';

export class UseCouponBodyDto extends PickType(UserCouponDto, [
  'user_id',
  'coupon_id',
]) {
  @ApiProperty({ description: '금액', example: 1000 })
  price!: number;
}
