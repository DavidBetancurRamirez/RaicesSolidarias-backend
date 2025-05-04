import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ThankYouDto {
  @ApiProperty({ description: 'Mensaje de agradecimiento', example: '¡Gracias por ser parte!' })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'URL de la imagen de agradecimiento',
    example: 'https://s3.amazonaws.com/xxx/thank-you.jpg',
  })
  @IsString()
  imageUrl: string;
}
