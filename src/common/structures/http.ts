export interface Response<T> {
  data: T;
  message: string | null;
}

export interface Pagination<T> {
  items: T[];
  pagination: PaginationResponseDto;
}

export interface PaginationResponseDto {
  page: number;
  size: number;
  totalCount: number;
  totalPage: number;
}
