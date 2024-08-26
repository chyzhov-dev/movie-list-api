import { AuthRequest, AuthRequestPayload } from '@modules/auth/types/request';
import { UsersService } from '@modules/users/services/users.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    // private jwtService: JwtService,
    private moduleRef: ModuleRef,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  /**
   * Access check
   * @param {ExecutionContext} context
   * @return {Promise<boolean>}
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    /**
     * Get service by ModuleRef, because the service is not yet
     * available at the time of launch of this guard
     */
    const jwtService = this.moduleRef.get(JwtService, {
      strict: false,
    });

    try {
      request['user'] = await jwtService.verifyAsync<AuthRequestPayload>(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
    } catch {
      throw new UnauthorizedException();
    }

    /**
     * Check if users exist in db
     */
    const user = this.usersService.findOne(request.user.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }

  /**
   * Get the token from the request header
   * @param {e.Request} request
   * @return {string | undefined}
   * @private
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
