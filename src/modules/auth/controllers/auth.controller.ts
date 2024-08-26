import { AuthLoginRequest } from '@modules/auth/requests/auth-login.request';
import { AuthRegisterRequest } from '@modules/auth/requests/auth-register.request';
import { AuthRequestPayload, AuthResponse } from '@modules/auth/types/request';
import { UsersService } from '@modules/users/services/users.service';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  public async login(
    @Body() body: AuthLoginRequest,
  ): Promise<AuthResponse> {
    const { email, password } = body;
    const user = await this.usersService.findOneByEmail(email);
    const passwordIsCorrect = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !passwordIsCorrect) {
      throw new Error('Invalid credentials');
    }

    const payload: AuthRequestPayload = { id: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  @Post('register')
  public async register(
    @Body() body: AuthRegisterRequest,
  ): Promise<AuthResponse> {
    const { email, password } = body;
    const isExist = await this.usersService.findOneByEmail(email);

    if (isExist) {
      throw new Error('User already exists');
    }

    const user = await this.usersService.create({ email, password });
    const payload: AuthRequestPayload = { id: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
