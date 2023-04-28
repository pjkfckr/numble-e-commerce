import { ICouponService } from './coupon.service.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponBodyDto } from '../interface/dto/create-coupon.body.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaProvider } from '../../common/providers/prisma.provider';
import { v4 as uuidV4 } from 'uuid';
import { Coupon } from '../../common/structures/coupon';
import { UpdateCouponBodyDto } from '../interface/dto/update-coupon.body.dto';
import { IssuedCouponBodyDto } from '../interface/dto/issued-coupon.body.dto';
import dayjs from 'dayjs';
import { UserCoupon } from '../../common/structures/user-coupon';
import { ReadCouponQueryDto } from '../interface/dto/read-coupon.query.dto';
import {
  Pagination,
  PaginationResponseDto,
} from '../../common/structures/http';
import { UseCouponBodyDto } from '../interface/dto/use-coupon.body.dto';
import { CancelCouponBodyDto } from '../interface/dto/cancel-coupon.body.dto';
import { RemoveCouponBodyDto } from '../interface/dto/remove-coupon.body.dto';
@Injectable()
export class CouponService implements ICouponService {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = PrismaProvider.getInstance();
  }
  async create(input: CreateCouponBodyDto): Promise<Coupon> {
    const createdCoupon = await this.prisma.coupon.create({
      data: {
        id: uuidV4(),
        quantity: input.quantity ? input.quantity : null,
        start_date: input.start_date,
        end_date: input.end_date,
        valid_period: input.valid_period,
        discount_type: input.discount_type,
        discount_value: input.discount_value,
      },
    });
    return createdCoupon;
  }

  async update(input: UpdateCouponBodyDto): Promise<Coupon> {
    const updatedCoupon = await this.prisma.coupon.update({
      data: {
        quantity: input.quantity ? input.quantity : null,
        start_date: input.start_date,
        end_date: input.end_date,
        valid_period: input.valid_period,
        discount_type: input.discount_type,
        discount_value: input.discount_value,
      },
      where: { id: input.id },
    });
    return updatedCoupon;
  }

  async issued(input: IssuedCouponBodyDto): Promise<UserCoupon> {
    const issue = await this.prisma.$transaction(
      async (tx) => {
        const user = await tx.user.findFirstOrThrow({
          where: { id: input.userId },
        });
        const coupon = await tx.coupon.findFirstOrThrow({
          where: { id: input.couponId },
        });
        const userCoupon = await tx.userCoupon.findFirst({
          where: { userId: user.id, couponId: coupon.id },
        });
        if (userCoupon) return null;
        if (coupon.quantity != null && coupon.quantity <= 0) {
          return null;
        }

        if (user && coupon) {
          const createdUserCoupon = await tx.userCoupon.create({
            data: {
              id: uuidV4(),
              userId: user.id,
              couponId: coupon.id,
              issued_date: dayjs().toDate(),
              expiration_date: Coupon.calculateExpirationDate(
                coupon.valid_period,
                coupon.end_date,
              ),
            },
          });
          if (coupon.quantity != null)
            await tx.coupon.update({
              data: { quantity: { decrement: 1 } },
              where: { id: coupon.id },
            });
          return createdUserCoupon;
        }
        return null;
      },
      { isolationLevel: 'ReadCommitted' },
    );
    if (issue === null)
      throw new BadRequestException('쿠폰 발급에 실패했습니다');
    return issue;
  }

  async read(options: ReadCouponQueryDto): Promise<Pagination<UserCoupon>> {
    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.userCoupon.findMany({
        where: {
          userId: options.userId,
          expiration_date: { gt: dayjs().toDate() },
        },
        orderBy: { issued_date: 'desc' },
        take: options.size,
        skip: (options.page - 1) * options.size,
      }),
      this.prisma.userCoupon.count({
        where: {
          userId: options.userId,
          expiration_date: { gt: dayjs().toDate() },
        },
      }),
    ]);
    const pagination: PaginationResponseDto = {
      page: options.page,
      size: options.size,
      totalCount,
      totalPage: Math.ceil(totalCount / options.size),
    };
    return { items, pagination };
  }
  async use(input: UseCouponBodyDto): Promise<number> {
    const userCoupon = await this.prisma.userCoupon.findFirstOrThrow({
      where: { userId: input.user_id, couponId: input.coupon_id },
      include: { coupon: true },
    });
    if (userCoupon.used)
      throw new BadRequestException('이미 사용한 쿠폰입니다');
    if (userCoupon.expiration_date < dayjs().toDate())
      throw new BadRequestException('쿠폰이 만료되었습니다');

    await this.prisma.userCoupon.update({
      data: { used_date: dayjs().toDate(), used: true },
      where: { id: userCoupon.id },
    });
    const discount = Coupon.calculateDiscountValue(
      userCoupon.coupon.discount_value,
      input.price,
    );
    return userCoupon.coupon.discount_type === 'PERCENT'
      ? discount.percentage
      : discount.absolute;
  }
  async cancel(input: CancelCouponBodyDto): Promise<void> {
    const userCoupon = await this.prisma.userCoupon.findFirstOrThrow({
      where: { userId: input.user_id, couponId: input.coupon_id },
    });
    if (!userCoupon.used)
      throw new BadRequestException('사용하지 않은 쿠폰입니다');

    await this.prisma.userCoupon.update({
      data: { used_date: null, used: false },
      where: { id: userCoupon.id },
    });
    return;
  }

  async remove(input: RemoveCouponBodyDto): Promise<void> {
    const userCoupon = await this.prisma.userCoupon.findFirstOrThrow({
      where: { userId: input.user_id, couponId: input.coupon_id },
    });
    if (userCoupon.used)
      throw new BadRequestException('사용한 쿠폰은 삭제할 수 없습니다');

    await this.prisma.userCoupon.delete({ where: { id: userCoupon.id } });
  }
}
