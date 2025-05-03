import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorator';

import { ResponsesSecurity } from '@/common/decorators/responses-security.decorator';
import { UserRoles } from '@/common/enums/user-roles.enum';

import { CreateUserDto } from './dto/create-user.dto';

import { UserService } from './user.service';

import { User } from './user.schema';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { UserActiveInterface } from '@/common/interfaces/user.interface';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create or update an user' })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createOrUpdate(createUserDto);
  }

  @Auth([UserRoles.USER])
  @ResponsesSecurity()
  @ApiOperation({ summary: 'Find all users' })
  @Get()
  findAll(@ActiveUser() userActive: UserActiveInterface): Promise<User[]> {
    console.log('userActive', userActive);
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @ApiOperation({ summary: 'Create or update an user' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.userService.softDelete(id);
  }
}
