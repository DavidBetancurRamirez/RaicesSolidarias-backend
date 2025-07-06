import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

import { MediaDto } from '@/common/dto/media.dto';
import { StatisticDto } from '../../common/dto/statistic.dto';
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
    description: 'Imagen principal del lugar',
    required: false,
  })
  @IsOptional()
  @Type(() => MediaDto)
  mainMedia?: MediaDto;

  @ApiProperty({
    description: 'Estadísticas de la entrega',
    required: false,
    type: [StatisticDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticDto)
  statistics: StatisticDto[];

  @ApiProperty({
    description: 'Información de agradecimiento',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThankYouDto)
  thankYou?: ThankYouDto;
}
