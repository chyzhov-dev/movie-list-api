import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationRequest {
  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @Min(1)
  public page?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  @Max(50)
  @IsOptional()
  public perPage?: number;
}
