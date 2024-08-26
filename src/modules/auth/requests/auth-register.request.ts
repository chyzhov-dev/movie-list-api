import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Min } from 'class-validator';

export class AuthRegisterRequest {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  @Min(3)
  public password: string;
}
