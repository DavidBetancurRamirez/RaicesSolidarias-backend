import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { MediaDto } from '@/common/dto/media.dto';
import { ThankYouDto } from './tank-you.dto';

export class CreateDeliveryDto {
  @ApiProperty({ description: 'Año de la entrega', example: 2025 })
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'Descripción de la entrega',
    example: 'Entrega anual en diferentes ciudades...',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ID of the delivery to update. If not provided, a new delivery will be created.',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  id?: string;

  @ApiProperty({
    description: 'Imagen principal de la entrega',
    required: false,
  })
  @IsOptional()
  @Type(() => MediaDto)
  mainMedia?: MediaDto;

  @ApiProperty({
    description: 'Información de agradecimiento',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThankYouDto)
  thankYou?: ThankYouDto;
}
