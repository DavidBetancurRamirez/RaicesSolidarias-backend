import { Testimonial } from '@/testimonial/testimonial.schema';
import { Place } from '../place.schema';
import { CreatePlaceDto } from './create-place.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Delivery } from '@/delivery/delivery.schema';
import { Types } from 'mongoose';

export class PlaceWithTestimonialsDto extends CreatePlaceDto {
  testimonials?: Testimonial[];
}

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
  name: string;

  @ApiProperty({
    description: 'URL de la media secundaria',
    required: false,
  })
  @IsOptional()
  @IsString()
  secondaryMediaUrl: string;

  testimonials?: Testimonial[];
}

export interface PlaceWithTestimonials extends Place {
  testimonials?: Testimonial[];
}
