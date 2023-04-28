import { OmitType } from '@nestjs/swagger';
import { CouponDto } from './coupon.dto';

export class CreateCouponBodyDto extends OmitType(CouponDto, ['id'] as const) {}
