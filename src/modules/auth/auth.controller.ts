import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: AuthDto, @Res() res) {
    try {
      const response = await this.authService.signIn(email, password);
      res.status(HttpStatus.OK).send(response);
    } catch {
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }

  @Post('register')
  async register(@Body() { email, password }: AuthDto, @Res() res) {
    try {
      const response = await this.authService.signUp(email, password);
      res.status(HttpStatus.CREATED).send(response);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
