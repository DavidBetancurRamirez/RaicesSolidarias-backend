import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Avatar of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'User Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'ID of the user to update. If not provided, a new user will be created.',
  })
  @IsOptional()
  @IsMongoId()
  id: string;

  @ApiProperty({
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  userName: string;
}
