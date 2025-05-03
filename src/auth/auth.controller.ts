import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  register(@Body() registerDto: CreateUserDto): Promise<LoginResponse> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh Token' })
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponse> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
