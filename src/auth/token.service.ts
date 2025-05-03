import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginResponse } from './interfaces/login.interfaces';
import { Payload } from './interfaces/auth.interface';

import { User } from '@/user/user.schema';

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret =
      this.configService.get<string>('JWT_SECRET') ??
      (() => {
        throw new Error('JWT_SECRET is not defined');
      })();
    this.refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ??
      (() => {
        throw new Error('JWT_REFRESH_SECRET is not defined');
      })();
  }

  generateTokens(user: User): LoginResponse {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken, data: user };
  }

  generateAccessToken(user: User): string {
    const payload: Payload = { email: user.email, roles: user.roles, sub: user._id as string };
    return this.jwtService.sign(payload, { secret: this.accessSecret, expiresIn: '1d' });
  }

  generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user._id as string };
    return this.jwtService.sign(payload, { secret: this.refreshSecret, expiresIn: '7d' });
  }

  verifyAccessToken(token: string): Payload {
    try {
      return this.jwtService.verify(token, { secret: this.accessSecret });
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): Payload {
    try {
      return this.jwtService.verify(token, { secret: this.refreshSecret });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
