import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @Transform(({ value }) => toPage(value, { default: 1 }))
  @ApiProperty({
    name: 'page',
    description: '조회하고자 하는 페이지 (기본값: 1)',
    required: false,
    example: 1,
  })
  page!: number;

  @Transform(({ value }) => toSize(value, { default: 10 }))
  @ApiProperty({
    name: 'size',
    description: '불러올 아이템 갯수 (기본값: 10)',
    required: false,
    example: 10,
  })
  size!: number;
}

interface PaginationOptions {
  default: number;
}

export function toPage(value: string, options: PaginationOptions): number {
  if (value) {
    const page = Number.parseInt(value);
    return page > 0 ? page : options.default;
  }
  return options.default;
}

export function toSize(value: string, options: PaginationOptions): number {
  if (value) {
    const size = Number.parseInt(value);
    return size > 0 ? size : options.default;
  }
  return options.default;
}
