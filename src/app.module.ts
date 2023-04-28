import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CouponModule } from './coupon/coupon.module';


@Module({
  imports: [UserModule, CouponModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
