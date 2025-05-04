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

import { StatisticDto } from './statistic.dto';
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
    description: 'ID of the user to update. If not provided, a new user will be created.',
  })
  @IsOptional()
  @IsMongoId()
  id: string;

  @ApiProperty({
    description: 'URL de la imagen principal',
    example: 'https://s3.amazonaws.com/xxx/main-2025.jpg',
  })
  @IsString()
  mainImageUrl: string;

  @ApiProperty({ description: 'Estadísticas de la entrega', type: [StatisticDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticDto)
  statistics: StatisticDto[];

  @ApiProperty({ description: 'Información de agradecimiento' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThankYouDto)
  thankYou: ThankYouDto;
}
