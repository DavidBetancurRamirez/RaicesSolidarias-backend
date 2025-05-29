import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
