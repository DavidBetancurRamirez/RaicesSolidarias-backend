import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ThankYouDto {
  @ApiProperty({ description: 'Mensaje de agradecimiento', example: '¡Gracias por ser parte!' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'URL de la imagen de agradecimiento', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
