import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { MediaDto } from '@/common/dto/media.dto';

export class ThankYouDto {
  @ApiProperty({ description: 'Mensaje de agradecimiento', example: '¡Gracias por ser parte!' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Archivo multimedia de agradecimiento', required: false })
  @IsOptional()
  @Type(() => MediaDto)
  media?: MediaDto;
}
