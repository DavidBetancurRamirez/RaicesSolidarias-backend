import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class TestimonialDto {
  @ApiProperty({ description: 'Eliminar el testimonio' })
  @IsOptional()
  @IsBoolean()
  delete?: boolean;

  @ApiProperty({
    description:
      'ID of the testimonial to update. If not provided, a new testimonial will be created.',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  id?: string;

  @ApiProperty({ description: 'Testimonio' })
  @IsString()
  testimonial: string;
}
