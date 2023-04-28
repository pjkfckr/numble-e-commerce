import { CreateCouponBodyDto } from '../interface/dto/create-coupon.body.dto';
import { Coupon } from '../../common/structures/coupon';
import { UpdateCouponBodyDto } from '../interface/dto/update-coupon.body.dto';
import { IssuedCouponBodyDto } from '../interface/dto/issued-coupon.body.dto';
import { UserCoupon } from '../../common/structures/user-coupon';
import { ReadCouponQueryDto } from '../interface/dto/read-coupon.query.dto';
import { Pagination } from '../../common/structures/http';
import { UseCouponBodyDto } from '../interface/dto/use-coupon.body.dto';
import { CancelCouponBodyDto } from '../interface/dto/cancel-coupon.body.dto';
import { RemoveCouponBodyDto } from '../interface/dto/remove-coupon.body.dto';

export interface ICouponService {
  /**
   * 쿠폰 생성
   */
  create: (input: CreateCouponBodyDto) => Promise<Coupon>;
  /**
   * 쿠폰 정보 업데이트
   */
  update: (input: UpdateCouponBodyDto) => Promise<Coupon>;
  /**
   * 쿠폰 발급
   */
  issued: (input: IssuedCouponBodyDto) => Promise<UserCoupon>;
  /**
   * 쿠폰 정보 조회
   * @param options 쿠폰 조회 옵션
   */
  read: (options: ReadCouponQueryDto) => Promise<Pagination<UserCoupon>>;
  /**
   * 쿠폰 사용
   */
  use: (input: UseCouponBodyDto) => Promise<number>;
  /**
   * 쿠폰 사용 취소
   */
  cancel: (input: CancelCouponBodyDto) => Promise<void>;
  /**
   * 쿠폰 삭제
   */
  remove: (input: RemoveCouponBodyDto) => Promise<void>;
}
