import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class MoviesCreateRequest {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear() + 100)
  public year: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  public file: unknown;
}
