import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  @Max(50)
  @IsOptional()
  perPage?: number;
}
