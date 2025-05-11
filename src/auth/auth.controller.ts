import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';

import { LoginResponse } from './interfaces/login.interfaces';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @Post('register')
  async register(
    @Body() registerDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const { accessToken, ...rest } = await this.authService.register(registerDto);

    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return rest;
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const { accessToken, ...rest } = await this.authService.login(loginDto);

    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return rest;
  }

  @ApiOperation({ summary: 'Refresh Token' })
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const { accessToken, ...rest } = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );

    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return rest;
  }
}
