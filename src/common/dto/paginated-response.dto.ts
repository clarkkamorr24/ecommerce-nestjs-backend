// common/dto/paginated-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class PaginatedMetaDto {
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMetaDto;
}

export function PaginatedResponseDto<T>(classRef: Type<T>) {
  class PaginatedDto {
    @ApiProperty({ type: [classRef] })
    data: T[];

    @ApiProperty({ type: PaginatedMetaDto })
    meta: PaginatedMetaDto;
  }

  return PaginatedDto;
}
