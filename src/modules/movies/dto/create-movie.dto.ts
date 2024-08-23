import { IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';


export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear() + 100)
  year: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
