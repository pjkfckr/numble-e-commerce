import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class UserCouponDto {
  @ApiProperty({ description: '사용자 쿠폰 ID', format: 'uuid' })
  id!: string;
  @ApiProperty({ description: '발급 날짜' })
  issued_date!: Date;
  @ApiProperty({ description: '만료 날짜' })
  expiration_date!: Date;
  @ApiProperty({ description: '사용 날짜', nullable: true })
  used_date?: Date;
  @ApiProperty({ description: '사용 여부', default: false })
  is_used!: boolean;
  @ApiProperty({ description: '사용자 ID', format: 'uuid' })
  user_id!: string;
  @ApiProperty({ description: '쿠폰 ID', format: 'uuid' })
  coupon_id!: string;
}
