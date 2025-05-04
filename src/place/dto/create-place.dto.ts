import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsDate, IsMongoId, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { StatisticDto } from '@/common/dto/statistic.dto';

export class CreatePlaceDto {
  @ApiProperty({ description: 'ID del delivery asociado', example: '60d21b4667d0d8992e610c85' })
  @IsMongoId()
  deliveryId: string;

  @ApiProperty({ description: 'Fecha de la entrega', example: '2025-05-10T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  deliveryDate: Date;

  @ApiProperty({ description: 'Descripción del lugar', example: 'Visitamos tal zona...' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ID of the place to update. If not provided, a new place will be created.',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  id?: string;

  @ApiProperty({
    description: 'URLs de la galería de imágenes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImageUrls?: string[];

  @ApiProperty({
    description: 'URL de la imagen principal',
    required: false,
  })
  @IsOptional()
  @IsString()
  mainImageUrl?: string;

  @ApiProperty({ description: 'Nombre del lugar', example: 'Medellín' })
  @IsString()
  placeName: string;

  @ApiProperty({
    description: 'URL de la imagen principal',
    required: false,
  })
  @IsOptional()
  @IsString()
  secondaryImageUrl: string;

  @ApiProperty({
    description: 'Estadísticas del lugar',
    type: [StatisticDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticDto)
  statistics: StatisticDto[];
}
