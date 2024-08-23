import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneByEmail(email);
    const passwordIsCorrect = await bcrypt.compare(pass, user.password);
    if (!user || !passwordIsCorrect) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const isExist = await this.usersService.findOneByEmail(email);
    if (isExist) {
      throw new Error('user_exists');
    }
    const user = await this.usersService.create({ email, password });
    const payload = { id: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
