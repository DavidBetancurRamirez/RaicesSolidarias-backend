import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

import { MediaDto } from '@/common/dto/media.dto';

import { Delivery } from '@/delivery/delivery.schema';
import { Testimonial } from '@/testimonial/testimonial.schema';

export class PlaceTestimonialsDto {
  @ApiProperty({ description: 'ID del delivery asociado', example: '60d21b4667d0d8992e610c85' })
  @IsMongoId()
  deliveryId: Delivery | Types.ObjectId;

  @ApiProperty({ description: 'Fecha de la entrega', example: '2025-05-10T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  deliveryDate: Date;

  @ApiProperty({ description: 'Descripción del lugar', example: 'Visitamos tal zona...' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URLs de la galería',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => MediaDto)
  galleryMedia?: MediaDto[];

  @ApiProperty({
    description: 'URL de la imagen principal',
    required: false,
  })
  @IsOptional()
  @IsString()
  mainImageUrl?: string;

  @ApiProperty({ description: 'Nombre del lugar', example: 'Medellín' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL de la media secundaria',
    required: false,
  })
  @IsOptional()
  @Type(() => MediaDto)
  secondaryMedia: MediaDto;

  @ApiProperty({
    description: 'Testimonios asociados al lugar',
    required: false,
    type: [Testimonial],
  })
  @IsOptional()
  testimonials?: Testimonial[];
}
