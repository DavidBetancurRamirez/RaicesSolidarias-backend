import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({
    description:
      'ID of the testimonial to update. If not provided, a new testimonial will be created.',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  id?: string;

  @ApiProperty({
    description: 'Testimonio',
    required: true,
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'ID of the place associated with the testimonial',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  place: string;
}
