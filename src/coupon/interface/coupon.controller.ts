import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ICouponService } from '../providers/coupon.service.interface';
import { InjectionToken } from '../providers/injection.token';
import { CreateCouponBodyDto } from './dto/create-coupon.body.dto';
import { Pagination, Response } from '../../common/structures/http';
import { Coupon } from '../../common/structures/coupon';
import { UpdateCouponBodyDto } from './dto/update-coupon.body.dto';
import { IssuedCouponBodyDto } from './dto/issued-coupon.body.dto';
import { UserCoupon } from '../../common/structures/user-coupon';
import { ReadCouponQueryDto } from './dto/read-coupon.query.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.query.dto';
import { UseCouponBodyDto } from './dto/use-coupon.body.dto';
import { CancelCouponBodyDto } from './dto/cancel-coupon.body.dto';
import { RemoveCouponBodyDto } from './dto/remove-coupon.body.dto';

@Controller('coupons')
@ApiTags('Coupon API')
export class CouponController {
  private readonly couponService: ICouponService;

  constructor(
    @Inject(InjectionToken.COUPON_SERVICE) private service: ICouponService,
  ) {
    this.couponService = service;
  }

  @Get('')
  @ApiOperation({ summary: 'Get Coupons' })
  async get(
    @Query() queries: ReadCouponQueryDto,
  ): Promise<Response<Pagination<UserCoupon>>> {
    const result = await this.couponService.read(queries);
    return this.baseResponse<Pagination<UserCoupon>>(result, 'get coupons');
  }

  @Post('')
  @ApiOperation({ summary: 'Create Coupon' })
  async registry(
    @Body() input: CreateCouponBodyDto,
  ): Promise<Response<Coupon>> {
    const result = await this.couponService.create(input);
    return this.baseResponse<Coupon>(result, 'created coupon');
  }

  @Put('')
  @ApiOperation({ summary: 'Update Coupon' })
  async update(@Body() input: UpdateCouponBodyDto): Promise<Response<Coupon>> {
    const result = await this.couponService.update(input);
    return this.baseResponse<Coupon>(result, 'updated coupon');
  }

  @Post('issue')
  @ApiOperation({ summary: 'Issue coupon' })
  async issue(
    @Body() input: IssuedCouponBodyDto,
  ): Promise<Response<UserCoupon>> {
    const result = await this.couponService.issued(input);
    return this.baseResponse<UserCoupon>(result, 'issued coupon');
  }

  @Post('use')
  @ApiOperation({ summary: 'Use coupon' })
  async use(@Body() input: UseCouponBodyDto): Promise<Response<number>> {
    const result = await this.couponService.use(input);
    return this.baseResponse(result, 'used coupon');
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel coupon' })
  async cancel(@Body() input: CancelCouponBodyDto): Promise<Response<string>> {
    await this.couponService.cancel(input);
    return this.baseResponse('success', 'canceled coupon');
  }

  @Delete('')
  @ApiOperation({ summary: 'Remove coupon' })
  async remove(@Body() input: RemoveCouponBodyDto): Promise<Response<string>> {
    await this.couponService.remove(input);
    return this.baseResponse('success', ' remove coupon');
  }

  @Post('')
  private baseResponse<T>(data: T, message: string): Response<T> {
    return { data, message };
  }
}
