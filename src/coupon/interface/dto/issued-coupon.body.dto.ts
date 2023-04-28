import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IssuedCouponBodyDto {
  @ApiProperty({ format: 'uuid', description: '쿠폰 ID' })
  couponId!: string;
  @ApiProperty({ format: 'uuid', description: '사용자 ID' })
  userId!: string;
}
