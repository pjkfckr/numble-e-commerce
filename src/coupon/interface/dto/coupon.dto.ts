import { Coupon } from '../../../common/structures/coupon';
import { Transform } from 'class-transformer';
import { validCouponType } from '../../coupon.validator';
import { ApiProperty } from '@nestjs/swagger';
import CouponDiscountType = Coupon.CouponDiscountType;
import { IsUUID } from 'class-validator';

export class CouponDto implements Coupon {
  @ApiProperty({ description: '쿠폰 ID', format: 'uuid' })
  @IsUUID()
  id!: string;
  @Transform(({ value }) => validCouponType(value))
  @ApiProperty({ description: '쿠폰 타입', example: 'absolute' })
  discount_type!: CouponDiscountType;
  @ApiProperty({ description: '쿠폰 할인 가격' })
  discount_value!: number;
  @ApiProperty({ description: '수량 (미입력시 무제한)', required: false })
  quantity?: number;
  @ApiProperty({ description: '시작 날짜' })
  start_date!: Date;
  @ApiProperty({ description: '만료 날짜' })
  end_date!: Date;
  @ApiProperty({ description: '만료 기간' })
  valid_period!: number;
}
