import { Coupon } from '../common/structures/coupon';
import CouponDiscountType = Coupon.CouponDiscountType;
import { BadRequestException } from '@nestjs/common';

const VALID_COUPON_TYPE = ['absolute', 'percentage'];
export function validCouponType(value: string): CouponDiscountType {
  if (!VALID_COUPON_TYPE.includes(value)) {
    throw new BadRequestException('not allowed type');
  }
  return <'absolute' | 'percentage'>value;
}
