import { Coupon } from './coupon';
import { User } from './user';

export interface UserCoupon {
  id: string;
  issued_date: Date;
  expiration_date: Date;
  used: boolean;
  used_date: Date | null;
  userId: string;
  couponId: string;
  coupon?: Coupon;
  user?: User;
}
