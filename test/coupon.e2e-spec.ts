import { INestApplication } from '@nestjs/common';
import { testInit } from './test.config';
import request from 'supertest';
import { PrismaProvider } from '../src/common/providers/prisma.provider';
import { v4 as uuidV4 } from 'uuid';
import dayjs from 'dayjs';
import { Pagination } from '../src/common/structures/http';
import { Coupon } from '../src/common/structures/coupon';

const mockCreateCouponData = {
  discount_type: 'absolute',
  discount_value: 1000,
  quantity: 10,
  start_date: new Date(),
  end_date: new Date(),
  valid_period: 30,
};

const mockUpdateCouponData = {
  id: '',
  discount_type: 'percentage',
  discount_value: 1000,
  quantity: 10,
  start_date: new Date(),
  end_date: dayjs().add(1, 'day').toDate(),
  valid_period: 30,
};

const mockUserCouponData = {
  issued_date: new Date(),
  expiration_date: Coupon.calculateExpirationDate(
    2,
    mockUpdateCouponData.end_date,
  ),
};

const mockData = {
  coupon_id: '',
  user_id: '',
  user_coupon_id: '',
};

const mockPagination: Pagination<any> = {
  items: [
    {
      id: mockData.user_coupon_id,
      couponId: mockData.coupon_id,
      userId: mockData.user_id,
      issued_date: new Date(),
      used: false,
      used_date: null,
    },
  ],
  pagination: {
    page: 1,
    size: 10,
    totalCount: 1,
    totalPage: 1,
  },
};

const createMockUser = async () => {
  const userId = uuidV4();
  const prisma = PrismaProvider.getInstance();
  await prisma.user.create({
    data: { id: userId },
  });
  return userId;
};

const createMockCoupon = async () => {
  const couponId = uuidV4();
  const prisma = PrismaProvider.getInstance();
  await prisma.coupon.create({
    data: { ...mockCreateCouponData, id: couponId },
  });
  return couponId;
};

const createMockUserCoupon = async (
  userId: string,
  couponId: string,
  used = false,
) => {
  const userCouponId = uuidV4();
  const prisma = PrismaProvider.getInstance();
  await prisma.userCoupon.create({
    data: { ...mockUserCouponData, id: userCouponId, userId, couponId, used },
  });
  return userCouponId;
};

describe('CouponController (e2e)', () => {
  let app: INestApplication;

  const prisma = PrismaProvider.getInstance();

  beforeAll(async () => {
    app = await testInit();

    mockData.user_id = await createMockUser();
    mockData.coupon_id = await createMockCoupon();
  });

  afterAll(async () => {
    await prisma.$queryRawUnsafe(`Truncate "UserCoupon" cascade`);
    await prisma.$queryRawUnsafe(`Truncate "Coupon" cascade`);
    await prisma.$queryRawUnsafe(`Truncate "User" cascade`);
  });

  it('/coupons (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/coupons')
      .send(mockCreateCouponData);
    expect(response.status).toBe(201);
    expect(response.body.data.discount_type).toBe(
      mockCreateCouponData.discount_type,
    );
  });

  it('/coupons (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      `/coupons?page=1&size=10&userId=${mockData.user_id}`,
    );

    expect(response.status).toBe(200);
  });

  it('/coupons (PUT)', async () => {
    mockUpdateCouponData.id = mockData.coupon_id;
    const response = await request(app.getHttpServer())
      .put('/coupons')
      .send(mockUpdateCouponData);

    expect(response.status).toBe(200);
    expect(response.body.data.discount_type).toEqual(
      mockUpdateCouponData.discount_type,
    );
  });

  it('/coupons (DELETE)', async () => {
    const user_id = await createMockUser();
    const coupon_id = await createMockCoupon();
    await createMockUserCoupon(user_id, coupon_id);

    const response = await request(app.getHttpServer())
      .delete(`/coupons`)
      .send({
        user_id,
        coupon_id,
      });

    expect(response.status).toBe(200);
  });

  it('/coupons/issue (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/coupons/issue')
      .send({
        coupon_id: mockData.coupon_id,
        user_id: mockData.user_id,
      });

    expect(response.status).toBe(201);
  });

  it('/coupons/use (POST)', async () => {
    await prisma.userCoupon.create({
      data: {
        id: uuidV4(),
        userId: mockData.user_id,
        couponId: mockData.coupon_id,
        ...mockUserCouponData,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/coupons/use')
      .send({
        user_id: mockData.user_id,
        coupon_id: mockData.coupon_id,
        price: 4000,
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(3000);
  });

  it('/coupons/cancel (POST)', async () => {
    const user_id = await createMockUser();
    const coupon_id = await createMockCoupon();
    const user_coupon_id = await createMockUserCoupon(user_id, coupon_id, true);

    const response = await request(app.getHttpServer())
      .post('/coupons/cancel')
      .send({
        user_id: user_id,
        coupon_id: coupon_id,
      });

    expect(response.status).toBe(201);
  });
});
