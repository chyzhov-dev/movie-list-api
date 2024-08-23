import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: AuthDto) {
    return this.authService.signIn(email, password);
  }

  @Post('register')
  async register(@Body() { email, password }: AuthDto) {
    return this.authService.signUp(email, password);
  }
}
