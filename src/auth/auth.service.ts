import * as bcryptjs from 'bcryptjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateUserDto } from '@/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { LoginResponse } from './interfaces/login.interfaces';

import { TokenService } from './token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: CreateUserDto): Promise<LoginResponse> {
    const user = await this.userService.createOrUpdate(registerDto);
    return this.tokenService.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const invalid_message = 'Invalid credentials';

    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(invalid_message);
    }

    const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(invalid_message);
    }

    return this.tokenService.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.userService.findByEmail(decoded?.email);
    if (!user) {
      throw new BadRequestException('Invalid or expired access token');
    }

    return this.tokenService.generateTokens(user);
  }
}
