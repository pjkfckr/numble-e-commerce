import { Module } from '@nestjs/common';
import { InjectionToken } from './providers/injection.token';
import { CouponService } from './providers/coupon.service';
import { CouponController } from './interface/coupon.controller';

@Module({
  providers: [
    { provide: InjectionToken.COUPON_SERVICE, useClass: CouponService },
  ],
  controllers: [CouponController],
})
export class CouponModule {}
