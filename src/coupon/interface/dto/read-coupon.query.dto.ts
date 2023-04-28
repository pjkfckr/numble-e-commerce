import { PaginationQueryDto } from '../../../common/dto/pagination.query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ReadCouponQueryDto extends PaginationQueryDto {
  @ApiProperty({ format: 'uuid', description: '사용자 ID' })
  @IsUUID()
  userId!: string;
}
