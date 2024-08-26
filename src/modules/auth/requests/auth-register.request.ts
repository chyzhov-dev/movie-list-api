import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from "class-validator";

export class AuthRegisterRequest {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 30)
  public password: string;
}
